# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.
import json
from django.http import HttpResponse, HttpResponseBadRequest
from django.conf import settings
from django.views.decorators.cache import cache_page
from steptracker.utils.email import is_email_valid
from models import AuthToken

def validate_token(request):
    pass

def auth(request):

    return HttpResponse(json.dumps([{
        "lat": x.lat,
        "lon": x.lon,
        "name": x.name,
        "address": x.address,
        "website": x.get_prefixed_website(),
        "phone": x.phone,
        "id": x.id,
        "national_phone_number": x.get_national_phone_number(),
        "international_phone_number": x.get_international_phone_number(),
        "absolute_url": x.get_absolute_url(),
        "tags": [tag.name for tag in x.tags.all()],
    } for x in Restaurant.objects.filter(**f).prefetch_related("tags")], indent=4))


def gen_token(request):

    email = request.GET.get('email')

    if email is None or not is_email_valid(email):
        return HttpResponseBadRequest('email parameter is missing or invalid')

    token_string = AuthToken.gen_token()
    return HttpResponse(json.dumps([{
        "token": x.lat,
        "lon": x.lon,
        "name": x.name,
        "address": x.address,
        "website": x.get_prefixed_website(),
        "phone": x.phone,
        "id": x.id,
        "national_phone_number": x.get_national_phone_number(),
        "international_phone_number": x.get_international_phone_number(),
        "absolute_url": x.get_absolute_url(),
        "tags": [tag.name for tag in x.tags.all()],
    } for x in Restaurant.objects.filter(**f).prefetch_related("tags")], indent=4))
