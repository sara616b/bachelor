from django.urls import path
from pagemanager.views.website import (IndexView)

app_name = 'pagemanager'

urlpatterns = [
    path('', IndexView.as_view(), name='IndexView'),
]
