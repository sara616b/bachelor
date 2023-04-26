from django.shortcuts import render
from django.views import View
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login


class LoginView(View):
    def get(self, request):
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
            return HttpResponseRedirect(reverse('page_manager:index'))
        else:
            print('ERROR')
