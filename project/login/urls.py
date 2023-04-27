from django.urls import path, include
from login.views import (LoginView, LogoutView)

urlpatterns = [
    path('login/', LoginView.as_view(), name='LoginView'),
    path('logout/', LogoutView.as_view(), name='LogoutView'),
]
