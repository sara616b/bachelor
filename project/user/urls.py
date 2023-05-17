from django.urls import path
from user.views.cms import (DeleteUserView)
from user.views.api import (
    GetAllUsersApi,
    GetUserApi,
    GetPermissionsApi,
    CreateUserApi
)

urlpatterns = [
    path(
        'user/delete/', DeleteUserView.as_view(), name='DeleteUserView'
    ),

    path('api/users/create/', CreateUserApi.as_view()),
    path(
        'api/permissions/',
        GetPermissionsApi.as_view(),
        name='GetPermissionsApi'
    ),
    path('api/users/', GetAllUsersApi.as_view(), name='GetAllUsersApi'),
    path('api/users/<username>', GetUserApi.as_view(), name='GetUserApi'),
]
