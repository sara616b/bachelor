from django.urls import path
from user.views import (
    GetAllUsersApi,
    UserApi,
    GetPermissionsApi,
)

urlpatterns = [
    path('api/users/', GetAllUsersApi.as_view(), name='GetAllUsersApi'),
    path('api/users/<username>/', UserApi.as_view(), name='UserApi'),
    path(
        'api/permissions/',
        GetPermissionsApi.as_view(),
        name='GetPermissionsApi'
    ),
]
