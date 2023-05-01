from django.shortcuts import reverse, redirect
from django.views import View
from django.contrib.auth.models import User, Permission
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import F
from django.http import JsonResponse
from django.db import IntegrityError, transaction
# import json
# from django.views.decorators.csrf import ensure_csrf_cookie
# from urllib.parse import quote_plus


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


class GetPermissionsApi(LoginRequiredMixin, View):
    def get(self, request):
        try:
            permissions = Permission.objects.all().annotate(
                value=F('codename'),
                label=F('name')
            ).values(
                'label',
                'value',
            )
        except Exception as ex:
            return JsonResponse({
                'result': ex
            }, status=500)

        return JsonResponse(
            data={
                'permissions': list(permissions),
            },
            status=200
        )


class CreateUserApi(View):

    def post(self, request):
        firstname = request.POST["firstname"]
        lastname = request.POST["lastname"]
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        is_superuser = request.POST["is_superuser"]
        permissions = request.POST["permissions"].split(',')
        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                )
                user.first_name = firstname
                user.last_name = lastname
                user.is_staff = True
                user.is_superuser = True if is_superuser == 'true' else False
                if len(permissions) != 0 and permissions[0] != '':
                    user.user_permissions.set(
                        [
                            Permission.objects.get(codename=permission)
                            for permission
                            in permissions
                        ]
                    )

                user.save()
        except IntegrityError as ex:
            return JsonResponse({
                'result': f'username and email must be unique. Error: {ex}'
            }, status=400)
        except Exception as ex:
            return JsonResponse({
                'result': f'{ex}'
            }, status=500)

        return redirect(reverse('UsersView'))
