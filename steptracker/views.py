# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.conf import settings
from django.shortcuts import redirect

from models import AuthToken, User
from datetime import datetime
from django.views.decorators.cache import cache_page


def validate_token(request):
    email_param = request.GET.get('email')
    validation_key_param = request.GET.get('validation_key', None)

    if email_param is None or validation_key_param is None:
        return HttpResponseBadRequest('email & validation_key parameters are required')

    email_param = email_param.lower()

    token = AuthToken.objects.get(validation_key=validation_key_param)

    if token.user.email != email_param:
        return HttpResponseBadRequest('given token does not match email address')

    token.validate(validation_key=validation_key_param)
    token.save()

    if token.valid:
        return redirect(settings.PUBLIC_URL)


def update_profile(request):
    token_param = request.GET.get('token')

    if not AuthToken.is_token_valid(token_param) and settings.DEBUG is False:
        return JsonResponse({'status': 'INVALID_TOKEN'})

    name = request.GET.get('nickname')
    if not name:
        return HttpResponseBadRequest('nickname get parameter is required')

    nickname_max_size = 25
    if len(name) > nickname_max_size:
        return JsonResponse({'status': 'NICKNAME_TOO_LONG', 'max_size': nickname_max_size})

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

    email_param = email_param.lower()

    if token_param is None:  # register new token
        user_list = User.objects.filter(email=email_param)

        if not user_list:
            u = User(email=email_param)
            u.reset_public_name()
            u.save()
        else:
            u = user_list[0]

        token = AuthToken(token_string=AuthToken.gen_token_string(email_param), user=u)
        token.gen_validation_key()
        token.save()

        token.send_validation_mail(public_url='https://' + request.META.get('HTTP_HOST', settings.PUBLIC_URL))
        token.save()

        return JsonResponse({'token': token.token_string, 'status': 'OK'})
    else:  # actual auth
        token_list = AuthToken.objects.filter(token_string=token_param)
        if len(token_list) == 0:
            return JsonResponse({'status': 'TOKEN_NOT_FOUND'})

        token = token_list[0]

        if token.valid is False:
            return JsonResponse({'status': 'TOKEN_NOT_ACTIVATED'})
        if token.valid and email_param == token.user.email:
            return JsonResponse({'status': 'OK', 'public_name': token.user.public_name})


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

    dst, status = Level.distance(level_from, level_to)

    return JsonResponse({'status': status, 'distance': dst})


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
    token_param = request.GET.get('token')
    if not AuthToken.is_token_valid(token_param) and settings.DEBUG is False:
        return JsonResponse({'status': 'INVALID_TOKEN'})

    steps = request.GET.get('steps')
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
    weekly_stats = UserStats.get_weekly_stats(token.user)
    all_time_stats = UserStats.get_all_time_stats(token.user)
    prestige, challenge_progress = divmod(all_time_stats.get('all_time_steps'), 1000)
    return JsonResponse({'status': 'OK',
                         'nick_name': token.user.public_name,
                         'all_time_stats': all_time_stats,
                         'weekly_stats': weekly_stats,
                         'current_challenge': {
                             'id': '1',
                             'prestige': prestige,
                             'name': 'mount_europa',
                             'total_steps': '1000',
                             'current_steps': challenge_progress,
                         },
                         })


def weekly_stat(request):
    week = request.GET.get('week')
    token_param = request.GET.get('token')
    if not AuthToken.is_token_valid(token_param) and settings.DEBUG is False:
        return JsonResponse({'status': 'INVALID_TOKEN'})

    if week:
        try:
            week = datetime.strptime(week, '%m-%d-%Y')
        except:
            return JsonResponse({'status': 'ILLEGAL_DATE_FORMAT'})

    from models import UserStats
    token = AuthToken.objects.get(token_string=token_param)
    weekly_stats = UserStats.get_weekly_stats(token.user, week)

    return JsonResponse({'status': 'OK',
                         'week_of': week - datetime.timedelta(days=week.weekday()),
                         'weekly_stats': weekly_stats,
                         })


def top_ten(request):
    week = request.GET.get('week')
    if week:
        try:
            week = datetime.strptime(week, '%m-%d-%Y')
        except:
            return JsonResponse({'status': 'ILLEGAL_DATE_FORMAT'})

    from models import UserStats

    top10_stats = UserStats.get_weekly_top_10(week)
    top10 = []
    for s in top10_stats:
        all_time_stats = UserStats.get_all_time_stats(s.user)
        prestige, challenge_progress = divmod(all_time_stats.get('all_time_steps'), 1000)

        top10.append({'name': s.user.public_name,
                      'id': s.user.pk,
                      'prestige': prestige,
                      'total_steps': s.total_steps()
                      })

    return JsonResponse({'status': 'OK',
                         'top_10': top10,
                         })


def all_time_top_ten(request):
    from models import UserStats

    top10_stats = UserStats.get_all_time_top_10()
    top10 = []
    for user, steps in top10_stats:
        if steps == 0:
            continue

        prestige, challenge_progress = divmod(steps, 1000)

        top10.append({'name': user.public_name,
                      'id': user.pk,
                      'prestige': prestige,
                      'total_steps': steps
                      })

    return JsonResponse({'status': 'OK',
                         'top_10': top10,
                         })


def my_ranking_weekly(request):
    from models import UserStats

    week = request.GET.get('week')
    token_param = request.GET.get('token')
    if not AuthToken.is_token_valid(token_param) and settings.DEBUG is False:
        return JsonResponse({'status': 'INVALID_TOKEN'})

    token = AuthToken.objects.get(token_string=token_param)

    if week:
        try:
            week = datetime.strptime(week, '%m-%d-%Y')
        except:
            return JsonResponse({'status': 'ILLEGAL_DATE_FORMAT'})

    ranking_list = []

    for ranking, user, total_steps, isUser in UserStats.get_weekly_ranking(token.user, week):
        all_time_stats = UserStats.get_all_time_stats(user)
        prestige, challenge_progress = divmod(all_time_stats.get('all_time_steps'), 1000)

        ranking_list.append({'name': user.public_name,
                             'id': user.pk,
                             'prestige': prestige,
                             'total_steps': total_steps,
                             'isUser': isUser,
                             'ranking': ranking,
                             })

    return JsonResponse({'status': 'OK',
                         'ranking': ranking_list,
                         })


def my_ranking_all_time(request):
    from models import UserStats

    token_param = request.GET.get('token')
    if not AuthToken.is_token_valid(token_param) and settings.DEBUG is False:
        return JsonResponse({'status': 'INVALID_TOKEN'})

    token = AuthToken.objects.get(token_string=token_param)

    ranking_list = []

    for ranking, user, total_steps, isUser in UserStats.get_all_time_ranking(token.user):
        prestige, challenge_progress = divmod(total_steps, 1000)

        ranking_list.append({'name': user.public_name,
                             'id': user.pk,
                             'prestige': prestige,
                             'total_steps': total_steps,
                             'isUser': isUser,
                             'ranking': ranking,
                             })

    return JsonResponse({'status': 'OK',
                         'ranking': ranking_list,
                         })


def qr_list_json(request):
    from models import Level
    res = []
    for qr in Level.objects.all():
        res.append({'id': qr.pk,
                    'building': qr.stairwell.building,
                    'shaft': qr.stairwell.shaft,
                    'level': qr.floorNumber,
                    'url': settings.PUBLIC_URL + 'app/#/scan?qr_id=' + str(qr.pk)})
    return JsonResponse({'status': 'OK', 'qr': res})


def qr_list(request):
    import csv
    from models import Level

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="qr.csv"'

    writer = csv.writer(response)
    writer.writerow(['id', 'building', 'shaft', 'level', 'url'])
    for qr in Level.objects.all():
        writer.writerow([qr.pk,
                         qr.stairwell.building,
                         qr.stairwell.shaft,
                         qr.floorNumber,
                         settings.PUBLIC_URL + 'app/#/scan?qr_id=' + str(qr.pk)
                         ])
    return response
