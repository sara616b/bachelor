from django.shortcuts import render, reverse, redirect
from django.views import View
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
import json
from django.db import IntegrityError


class UsersView(LoginRequiredMixin, View):
    def get(self, request):
        return render(
            request,
            'cms/render_bundle_base.html',
            {
                'title': 'Users | ',
                'bundle_name': 'cms_usersoverview',
            }
        )
    pass


class CreateUserView(View):
    def get(self, request):
        return render(
            request,
            'cms/render_bundle_base.html',
            {
                'title': 'Create New User | ',
                'bundle_name': 'cms_createuser',
            }
        )

    def post(self, request):
        firstname = request.POST["firstname"]
        lastname = request.POST["lastname"]
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        is_superuser = request.POST["is_superuser"]
        permissions = request.POST["permissions"]
        print(is_superuser)
        # try:
        #     user = User.objects.create_user(
        #         username=username,
        #         email=email,
        #         password=password,
        #     )
        # except IntegrityError as ex:
        #     return JsonResponse({
        #         'result': f'username and email must be unique. Error: {ex}'
        #     }, status=400)

        # user.first_name = firstname
        # user.last_name = lastname
        # user.is_staff = True
        # if is_superuser:
        #     user.is_superuser = True
        # user.user_permissions.set(permissions)
        
        # user.save()

        return redirect(reverse('UsersView'))


class EditUserView(View):
    def get(self, request, username):
        user = User.objects.get(username=username)
        print(user)
        return render(
            request,
            'cms/render_bundle_base.html',
            {
                'title': 'Edit User | ',
                'bundle_name': 'cms_edituser',
                'initial_data': {'username': username}
            }
        )

    pass


class DeleteUserView(View):
    pass
