from django.urls import path
from user.views.cms import (
    UsersView,
    EditUserView,
    CreateUserView
)
from user.views.api import (
    GetAllUsersApi,
    GetUserApi,
    GetPermissionsApi,
    CreateUserApi,
)

urlpatterns = [
    path('users/', UsersView.as_view(), name='UsersView'),
    path('users/new/', CreateUserView.as_view(), name='CreateUserView'),
    path('users/<username>/', EditUserView.as_view(), name='EditUserView'),
    # path('user/edit/<username>', CmsFrontend.as_view()),
    # path('user/create/', CmsFrontend.as_view()),

    # path('users/', UsersView.as_view(), name='UsersView'),
    # path('user/create/', CreateUserView.as_view(), name='CreateUserView'),
    # path('user/edit/<username>', EditUserView.as_view(), name='EditUserView'),  # noqa
    # path(
    #     'user/delete/', DeleteUserView.as_view(), name='DeleteUserView'
    # ),

    path('api/user/create/', CreateUserApi.as_view()),
    path(
        'api/permissions/',
        GetPermissionsApi.as_view(),
        name='GetPermissionsApi'
    ),
    path('api/users/', GetAllUsersApi.as_view(), name='GetAllUsersApi'),
    path('api/user/<username>', GetUserApi.as_view(), name='GetUserApi'),
]
