from django.urls import path, include
from login.views import (LoginView)

urlpatterns = [
    path('login/', LoginView.as_view(), name='LoginView'),
]
