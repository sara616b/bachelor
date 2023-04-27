from django.urls import path
from pagemanager.views.api import (GetAllPagesApi, GetPageApi, CreateNewPageApi, UpdatePageApi)

app_name = 'pagemanager-api'

urlpatterns = [
    path('api/page/all/', GetAllPagesApi.as_view(), name='GetAllPagesApi'),
    path('api/page/<slug>/', GetPageApi.as_view(), name='GetPageApi'),
    path('api/page/create/', CreateNewPageApi.as_view(), name='CreateNewPageApi'),
    path('api/page/<int:pk>/update', UpdatePageApi.as_view(), name='UpdatePageApi'),
]
