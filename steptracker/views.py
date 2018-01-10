# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
import json
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.conf import settings
from django.views.decorators.cache import cache_page
from steptracker.utils.email import is_email_valid
from models import AuthToken, User


def validate_token(request):
    email_param = request.GET.get('email')
    validation_key_param = request.GET.get('validation_key', None)

    if email_param is None or validation_key_param is None:
        return HttpResponseBadRequest('email & validation_key parameters are required')

    token = AuthToken.objects.get(validation_key=validation_key_param)

    if token.user.email != email_param:
        return HttpResponseBadRequest('given token does not match email address')

    token.validate(validation_key=validation_key_param)
    token.save()

    if token.valid:
        return HttpResponse(status=200)


def update_profile(request):
    token_param = request.POST.get('token')

    if not AuthToken.is_token_valid(token_param) and settings.DEBUG is False:
        return JsonResponse({'status': 'INVALID_TOKEN'})

    name = request.POST.get('nickname')
    if not name:
        return HttpResponseBadRequest('nickname post parameter is required')

    from django.utils.html import strip_tags, escape
    name = escape(strip_tags(name))

    token = AuthToken.objects.get(token_string=token_param)
    user = token.user
    user.public_name = name

    user.save()

    return JsonResponse({'status': 'OK'})


def auth(request):
    token_param = request.GET.get('token')
    email_param = request.GET['email']

    if token_param is None:  # register new token
        user_list = User.objects.filter(email=email_param)
        u = None
        if not user_list:
            u = User(email=email_param)
            u.save()
        else:
            u = user_list[0]

        token = AuthToken(token_string=AuthToken.gen_token_string(email_param), user=u)
        token.gen_validation_key()
        token.save()

        token.send_validation_mail(public_url=request.META.get('HTTP_HOST', settings.PUBLIC_URL))

        return JsonResponse({'token': token.token_string, 'status': 'OK'})
    else:  #actual auth
        token_list = AuthToken.objects.filter(token_string=token_param)
        if len(token_list) == 0:
            return JsonResponse({'status': 'TOKEN_NOT_FOUND'})

        token = token_list[0]

        if token.valid is False:
            return JsonResponse({'status': 'TOKEN_NOT_ACTIVATED'})
        if token.valid and email_param == token.user.email:
            return JsonResponse({'status': 'OK'})


def distance(request):
    qr1_param_id = request.GET.get('qr_id_1')
    qr2_param_id = request.GET.get('qr_id_2')

    if not qr1_param_id and qr2_param_id:
        return HttpResponseBadRequest('qr_id_1 & qr_id_2 parameters are required')

    if qr1_param_id == qr2_param_id:
        return HttpResponseBadRequest('qr_id_1 & qr_id_2 parameters must be different')

    from models import Level
    level_from = Level.objects.get(pk=qr1_param_id)
    level_to = Level.objects.get(pk=qr2_param_id)

    return JsonResponse({'status': 'OK', 'distance': Level.distance(level_from, level_to)})


def qr_info(request):
    qr1_param_id = request.GET.get('qr_id')

    if not qr1_param_id:
        HttpResponseBadRequest('qr_id parameter is required')

    from models import Level

    level = Level.objects.get(pk=qr1_param_id)

    return JsonResponse({'status': 'OK',
                         'id': qr1_param_id,
                         'building': level.stairwell.building,
                         'shaft': level.stairwell.shaft,
                         'level': level.floorNumber,
                         })


def log_distance(request):
    from models import UserStats
    token_param = request.POST.get('token')
    if not AuthToken.is_token_valid(token_param) and settings.DEBUG is False:
        return JsonResponse({'status': 'INVALID_TOKEN'})

    steps = request.POST.get('steps')
    if not steps:
        HttpResponseBadRequest('steps parameter is required')

    steps = int(steps)

    token = AuthToken.objects.get(token_string=token_param)
    user = token.user

    UserStats.record_stats(user, steps)

    return JsonResponse({'status': 'OK'})


def profile(request):
    token_param = request.GET.get('token')
    if not AuthToken.is_token_valid(token_param) and settings.DEBUG is False:
        return JsonResponse({'status': 'INVALID_TOKEN'})

    from models import UserStats
    token = AuthToken.objects.get(token_string=token_param)
    stats = UserStats.get_weekly_stats(token.user)

    return JsonResponse({'status': 'OK',
                         'nick_name': 'Johnny H',
                         'total_calories': '4852',
                         'total_steps': '74165',
                         'total_meters': '154',
                         'weekly_stats': stats,
                         'current_challenge': {
                             'id': '1',
                             'name': 'Atomium',
                             'total_steps': '1000',
                             'current_steps': '500',
                             'current_percent': '0.5',
                         },
                         })
