from django.urls import path
from page_manager.views.api import (GetAllPagesApi, GetPageApi, CreateNewPageApi, UpdatePageApi, DeletePageApi, UploadImageApi)

urlpatterns = [
    path('api/page/all/', GetAllPagesApi.as_view(), name='GetAllPagesApi'),
    path('api/page/create/', CreateNewPageApi.as_view(), name='CreateNewPageApi'),
    path('api/page/delete/<slug>', DeletePageApi.as_view(), name='DeletePageApi'),
    path('api/page/<slug>/', GetPageApi.as_view(), name='GetPageApi'),
    path('api/page/<int:pk>/update', UpdatePageApi.as_view(), name='UpdatePageApi'),
    path('api/image/create/', UploadImageApi.as_view(), name='UploadImageApi'),
]
