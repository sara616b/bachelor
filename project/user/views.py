from django.views import View
from django.contrib.auth.models import User, Permission
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import F
from django.http import JsonResponse
from django.db import IntegrityError, transaction
import json
from django.http.multipartparser import MultiPartParser
from django.core import serializers
from user.forms import UserForm
from django.http.request import QueryDict


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
        except Exception as ex:
            return JsonResponse({
                'result': f'{ex}'
            }, status=500)

        return JsonResponse(
            data={
                'users': list(users),
            },
            status=200
        )


class UserApi(LoginRequiredMixin, View):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({
                'result': 'No user found'
            }, status=404)

        data = serializers.serialize('json', [user], fields=(
            'username',
            'is_superuser',
            'first_name',
            'last_name',
            'email',
            'username'
        ))
        user_data = json.loads(data)[0]['fields']
        user_data['permissions'] = [
            permission.codename for permission in user.user_permissions.all()
        ]

        return JsonResponse({'user': user_data}, status=200)

    def post(self, request, username):
        if 'user.add_user' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        form = UserForm(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data

            firstname = cleaned_data['firstname']
            lastname = cleaned_data['lastname']
            email = cleaned_data['email']
            password = cleaned_data['password']
            is_superuser = cleaned_data.get('is_superuser', False)
            permissions = cleaned_data.get('permissions', '').split(',')

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
                    user.is_superuser = is_superuser
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

        else:
            return JsonResponse({'result': 'Invalid input'}, status=400)

        return JsonResponse(
            {
                'result': 'Created'
            }, status=201
        )

    def put(self, request, username):
        if 'user.edit_user' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({
                'result': 'No user found'
            }, status=404)

        try:
            PUT = MultiPartParser(
                request.META, request, request.upload_handlers
            ).parse()[0]
            put_dict = QueryDict(mutable=True)
            put_dict.update(PUT)

            form = UserForm(put_dict)
        except Exception as ex:
            return JsonResponse({
                'result': f'{ex}'
            }, status=500)

        if form.is_valid():
            cleaned_data = form.cleaned_data

            firstname = cleaned_data['firstname']
            lastname = cleaned_data['lastname']
            email = cleaned_data['email']
            password = cleaned_data['password']
            is_superuser = cleaned_data.get('is_superuser', False)
            permissions = cleaned_data.get('permissions', '').split(',')
            try:
                with transaction.atomic():
                    updated_fields = []
                    if user.first_name != firstname:
                        user.first_name = firstname
                        updated_fields.append('first_name')
                    if user.last_name != lastname:
                        user.last_name = lastname
                        updated_fields.append('last_name')
                    if user.email != email:
                        user.email = email
                        updated_fields.append('email')
                    if user.password != password:
                        user.password = password
                        updated_fields.append('password')
                    if user.is_superuser != is_superuser:
                        user.is_superuser = is_superuser
                        updated_fields.append('is_superuser')
                    if len(permissions) != 0 and permissions[0] != '':
                        user.user_permissions.set(
                            [
                                Permission.objects.get(codename=permission)
                                for permission
                                in permissions
                            ]
                        )
                    elif len(permissions) == 0 or permissions[0] == '':
                        user.user_permissions.clear()

                    user.save(update_fields=updated_fields)
            except Exception as ex:
                return JsonResponse({
                    'result': f'{ex}'
                }, status=500)

        else:
            return JsonResponse(
                {'result': 'Invalid input', 'errors': form.errors},
                status=400
            )

        return JsonResponse(
            {
                'result': 'Edited'
            }, status=200
        )

    def delete(self, request, username):
        if 'user.delete_user' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            User.objects.get(username=username).delete()
        except User.DoesNotExist:
            return JsonResponse({
                'result': 'User not found'
            }, status=404)
        except Exception as ex:
            return JsonResponse({
                'result': f'{ex}'
            }, status=500)

        return JsonResponse(
            {
                'result': 'Delete'
            }, status=200
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
            {
                'permissions': list(permissions),
            },
            status=200
        )
