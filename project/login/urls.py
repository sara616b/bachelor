from django.urls import path
from login.views import (LoginView, LogoutView, AuthenticatedView)

urlpatterns = [
    path(
        'login/',
        LoginView.as_view(),
        name='LoginView'
    ),
    path(
        'logout/',
        LogoutView.as_view(),
        name='LogoutView'
    ),
    path(
        'authenticated/',
        AuthenticatedView.as_view(),
        name='AuthenticatedView'
    ),
]
