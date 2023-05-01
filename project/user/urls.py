from django.urls import path
from user.views.cms import (DeleteUserView)
from user.views.api import (
    GetAllUsersApi,
    GetUserApi,
    GetPermissionsApi,
    CreateUserApi
)
from page_manager.views.cms import (CmsFrontend)

urlpatterns = [
    path('users/', CmsFrontend.as_view(), name='UsersView'),
    path('user/edit/<username>', CmsFrontend.as_view()),
    path('user/create/', CmsFrontend.as_view()),

    # path('users/', UsersView.as_view(), name='UsersView'),
    # path('user/create/', CreateUserView.as_view(), name='CreateUserView'),
    # path('user/edit/<username>', EditUserView.as_view(), name='EditUserView'),  # noqa
    path(
        'user/delete/', DeleteUserView.as_view(), name='DeleteUserView'
    ),

    path('api/user/create/', CreateUserApi.as_view()),
    path(
        'api/permissions/',
        GetPermissionsApi.as_view(),
        name='GetPermissionsApi'
    ),
    path('api/users/', GetAllUsersApi.as_view(), name='GetAllUsersApi'),
    path('api/user/<username>', GetUserApi.as_view(), name='GetUserApi'),
]
