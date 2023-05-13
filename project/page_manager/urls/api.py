from django.urls import path
from page_manager.views.api import (
    GetAllPagesApi,
    GetPageApi,
    CreateNewPageApi,
    UpdatePageApi,
    DeletePageApi,
    UploadImageApi,
    CreateObjectApi,
    DeleteObjectApi,
    MoveObjectApi,
    ChangeColumnAmount,
    UpdateComponentApi,
    GetPagePreviewApi,
    UpdateSectionApi,
    csrf,
    PingApi,
)

urlpatterns = [
    path('api/csrf/', csrf.as_view(), name="csrf"),
    path('api/ping/', PingApi.as_view(), name="ping"),
    path(
        'api/page/all/', GetAllPagesApi.as_view(), name='GetAllPagesApi'
    ),
    path(
        'api/page/create/', CreateNewPageApi.as_view(), name='CreateNewPageApi'
    ),
    path(
        'api/page/delete/<slug>/',
        DeletePageApi.as_view(),
        name='DeletePageApi'
    ),
    path(
        'api/page/update/<slug>/',
        UpdatePageApi.as_view(),
        name='UpdatePageApi'
    ),
    path(
        'api/page/<slug>/', GetPageApi.as_view(), name='GetPageApi'
    ),
    path(
        'api/page/<slug>/preview/',
        GetPagePreviewApi.as_view(),
        name='GetPagePreviewApi'
    ),
    path(
        'api/page/<slug>/<object>/create/<name>/',
        CreateObjectApi.as_view(),
        name='CreateObjectApi'
    ),
    path(
        'api/page/<slug>/<object>/delete/<index>/',
        DeleteObjectApi.as_view(),
        name='DeleteObjectApi'
    ),
    path(
        'api/page/<slug>/<object>/move/<index>/<direction>/',
        MoveObjectApi.as_view(),
        name='MoveObjectApi'
    ),
    path(
        'api/page/<slug>/column/change/<amount>/',
        ChangeColumnAmount.as_view(),
        name='ChangeColumnAmount'
    ),
    path(
        'api/page/<slug>/component/update/<index>/',
        UpdateComponentApi.as_view(),
        name='UpdateComponentApi'
    ),
    path(
        'api/page/<slug>/section/update/<index>/',
        UpdateSectionApi.as_view(),
        name='UpdateSectionApi'
    ),
    path(
        'api/image/create/', UploadImageApi.as_view(), name='UploadImageApi'
    ),
]
