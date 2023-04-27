from django.shortcuts import render, reverse, redirect
from django.views import View
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout


class LoginView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return redirect('FrontpageView')
        return render(
            request,
            'cms/render_bundle_base.html',
            {
                'title': 'Log In | ',
                'bundle_name': 'cms_login',
            }
        )
    
    def post(self, request):
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(reverse('FrontpageView'))
        else:
            return redirect(reverse('LoginView'))


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect(reverse('LoginView'))
