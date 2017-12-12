# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
import json
from django.http import HttpResponse, HttpResponseBadRequest
from django.conf import settings
from django.views.decorators.cache import cache_page
from steptracker.utils.email import is_email_valid
from models import AuthToken, User

def validate_token(request):
    email = request.GET.get('email')

    if email is None or not is_email_valid(email):
        return HttpResponseBadRequest('email parameter is missing or invalid')

    token_string = AuthToken.gen_token()
    return HttpResponse(json.dump({"token": token_string}))


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
        #todo: send mail
        return HttpResponse(json.dumps({'token': token.token_string, 'status': 'OK'}))
    else:  #actual auth
        token_list = AuthToken.objects.filter(token_string=token_param)
        if len(token_list) == 0:
            return HttpResponse(json.dumps({'status': 'TOKEN_NOT_FOUND'}))

        token = token_list[0]

        if token.valid is False:
            return HttpResponse(json.dumps({'status': 'TOKEN_NOT_ACTIVATED'}))
        if token.valid and email_param == token.user.email:
            return HttpResponse(json.dumps({'status': 'OK'}))

def gen_token(request):
    email = request.GET.get('email')

    if email is None or not is_email_valid(email):
        return HttpResponseBadRequest('email parameter is missing or invalid')

    token_string = AuthToken.gen_token_string(email)
    return HttpResponse(json.dumps({"token": token_string, "email": email}))
