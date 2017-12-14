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
    email_param = request.GET.get('email', None)
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


def auth(request):
    token_param = request.GET.get('token', None)
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


def get_distance(request):
    token_param = request.GET['token']
    if not AuthToken.is_token_valid(token_param):
        return JsonResponse({'status': 'INVALID_TOKEN'})

    qr1_param_id = request.GET.get('qr1')
    qr2_param_id = request.GET.get('qr2')
    if not qr1_param_id and qr2_param_id:
        HttpResponseBadRequest('qr1 & qr2 get parameter are needed')



def log_distance(request):
    token_param = request.GET['token']
    if not AuthToken.is_token_valid(token_param):
        return JsonResponse({'status': 'INVALID_TOKEN'})


def profile(request):
    token_param = request.GET['token']
    if not AuthToken.is_token_valid(token_param):
        return JsonResponse({'status': 'INVALID_TOKEN'})