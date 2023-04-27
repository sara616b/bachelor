from django.urls import path, include
from user.views.cms import (UsersView, CreateUserView, EditUserView, DeleteUserView)
from user.views.api import (GetAllUsersApi, GetUserApi)

urlpatterns = [
    path('users/', UsersView.as_view(), name='UsersView'),
    path('user/create/', CreateUserView.as_view(), name='CreateUserView'),
    path('user/edit/<username>', EditUserView.as_view(), name='EditUserView'),
    path('user/delete/', DeleteUserView.as_view(), name='DeleteUserView'),

    path('api/users/', GetAllUsersApi.as_view(), name='GetAllUsersApi'),
    path('api/user/<username>', GetUserApi.as_view(), name='GetUserApi'),
]
