from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse


class LoginView(View):
    def post(self, request):
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse(
                {'result': 'logged in'},
                status=200
            )
        else:
            return JsonResponse(
                {'result': 'user not found'},
                status=204
            )


class LogoutView(View):
    def get(self, request):
        logout(request)
        return JsonResponse(
            {'result': 'okay'},
            status=200
        )


class AuthenticatedView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse(
                {'result': 'authenticated'},
                status=200
            )
        else:
            return JsonResponse(
                {'result': 'unauthenticated'},
                status=204
            )
