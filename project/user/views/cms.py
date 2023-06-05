from django.shortcuts import render, reverse, redirect
from django.views import View
from django.contrib.auth.models import User, Permission
from django.db.models import F
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import IntegrityError
from django.contrib import messages
from django.forms.models import model_to_dict
from django.db import transaction
from page_manager.utils import get_put_data
from django.http import HttpResponseRedirect
from django.core.paginator import Paginator


class UsersView(LoginRequiredMixin, View):
    def get(self, request):
        users = [model_to_dict(user) for user in User.objects.all()]
        paginator = Paginator(users, 5)

        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(
            request,
            'Users/Cms/Pages/Users.html',
            {
                'title': 'Users | ',
                'users': page_obj
            }
        )


class CreateUserView(LoginRequiredMixin, View):
    def get(self, request):
        permissions = Permission.objects.all().annotate(
            value=F('codename'),
            label=F('name')
        ).values(
            'label',
            'value',
        )
        return render(
            request,
            'Users/Cms/Pages/CreateUser.html',
            {
                'title': 'Edit User | ',
                'permissions': permissions,
            }
        )

    def post(self, request):
        if 'auth.add_user' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You don't have permission to create users."
            )
        permissions = Permission.objects.all().annotate(
            value=F('codename'),
            label=F('name')
        ).values(
            'label',
            'value',
        )

        firstname = request.POST["first_name"]
        lastname = request.POST["last_name"]
        username = request.POST["username"]
        password = request.POST["password"]
        email = request.POST["email"]
        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                )
                user.first_name = firstname
                user.last_name = lastname
                user.is_superuser = True if "is_superuser" in request.POST else False  # noqa
                user_has_permissions = []
                for permission in permissions:
                    if permission['value'] in request.POST:
                        user_has_permissions.append(
                            Permission.objects.get(
                                codename=permission['value']
                            )
                        )

                user.user_permissions.set(user_has_permissions)

                user.save()
            messages.add_message(
                request,
                messages.INFO,
                'User Created.'
            )
        except IntegrityError:
            messages.add_message(
                request,
                messages.INFO,
                'Username and email must be unique.'
            )
        except Exception as e:
            print(e)
            messages.add_message(
                request,
                messages.INFO,
                'Something went wrong. Please try again.'
            )
        user.refresh_from_db()
        for permission in permissions:
            permission['user_has'] = True if permission['value'] in [perm.codename for perm in user.user_permissions.all()] else False  # noqa

        return HTTPResponseHXRedirect(reverse('UsersView'))


class HTTPResponseHXRedirect(HttpResponseRedirect):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self["HX-Redirect"] = self["Location"]

    status_code = 200


class EditUserView(LoginRequiredMixin, View):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            permissions = Permission.objects.all().annotate(
                value=F('codename'),
                label=F('name')
            ).values(
                'label',
                'value',
            )
        except User.DoesNotExist:
            messages.add_message(
                request,
                messages.INFO,
                'Something went wrong. Please try again.'
            )
            return redirect(reverse('UsersView'))
        for permission in permissions:
            permission['user_has'] = True if permission['value'] in [perm.codename for perm in user.user_permissions.all()] else False  # noqa
        return render(
            request,
            'Users/Cms/Pages/EditUser.html',
            {
                'title': 'Edit User | ',
                'user': user,
                'permissions': permissions,
            }
        )

    def put(self, request, username):
        if 'auth.change_user' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You don't have permission to edit users."
            )
        permissions = Permission.objects.all().annotate(
            value=F('codename'),
            label=F('name')
        ).values(
            'label',
            'value',
        )
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            messages.add_message(
                request,
                messages.INFO,
                'Something went wrong. Please try again.'
            )
            return redirect(reverse('UsersView'))

        request = get_put_data(request)

        firstname = request.PUT["first_name"]
        lastname = request.PUT["last_name"]
        username = request.PUT["username"]
        email = request.PUT["email"]
        try:
            with transaction.atomic():
                user.first_name = firstname
                user.last_name = lastname
                user.email = email
                user.username = username
                user.is_superuser = True if "is_superuser" in request.PUT else False  # noqa
                user_has_permissions = []
                for permission in permissions:
                    if permission['value'] in request.PUT:
                        user_has_permissions.append(
                            Permission.objects.get(
                                codename=permission['value']
                            )
                        )

                user.user_permissions.set(user_has_permissions)

                user.save()
            messages.add_message(
                request,
                messages.INFO,
                'User updated.'
            )
        except Exception as e:
            print(e)
            messages.add_message(
                request,
                messages.INFO,
                'Something went wrong. Please try again.'
            )
        user.refresh_from_db()
        for permission in permissions:
            permission['user_has'] = True if permission['value'] in [perm.codename for perm in user.user_permissions.all()] else False  # noqa
        return render(
            request,
            'Users/Cms/Pages/EditUser.html',
            {
                'title': 'Edit User | ',
                'user': user,
                'permissions': permissions,
            }
        )

    def delete(self, request, username):
        if 'auth.delete_user' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You don't have permission to delete users."
            )
        try:
            User.objects.get(username=username).delete()
        except User.DoesNotExist:
            messages.add_message(
                request,
                messages.INFO,
                'Something went wrong. Please try again.'
            )
        users = User.objects.all()
        return render(
            request,
            'Users/Cms/Pages/Users.html',
            {
                'title': 'Users | ',
                'users': [model_to_dict(user) for user in users]
            }
        )
