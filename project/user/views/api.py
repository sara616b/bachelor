from django.shortcuts import render, reverse, redirect
from django.views import View
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
import json
from django.views.decorators.csrf import ensure_csrf_cookie
from urllib.parse import quote_plus


class GetAllUsersApi(LoginRequiredMixin, View):
    def get(self, request):
        try:
            users = User.objects.all().values(
                'username',
                'is_superuser',
                'first_name',
                'last_name',
                'email',
                'username'
            )
        except User.DoesNotExist:
            return JsonResponse({
                'result': 'no users found'
            }, status=404)

        return JsonResponse(
            data={ 
                'users': list(users),
            },
            status=200
        )


class GetUserApi(LoginRequiredMixin, View):
    def get(self, request, username):
        try:
            user = User.objects.filter(username=username).values(
                'username',
                'is_superuser',
                'first_name',
                'last_name',
                'email',
                'username'
            )
        except User.DoesNotExist:
            return JsonResponse({
                'result': 'no user found'
            }, status=404)

        return JsonResponse(
            data={ 
                'user': list(user),
            },
            status=200
        )
