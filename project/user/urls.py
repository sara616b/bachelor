from django.urls import path, include
from user.views.cms import (
    UsersView,
    EditUserView,
    CreateUserView
)

urlpatterns = [
    path(
        'cms/',
        include(
            [
                path(
                    'users/',
                    UsersView.as_view(),
                    name='UsersView'
                ),
                path(
                    'users/new/',
                    CreateUserView.as_view(),
                    name='CreateUserView'
                ),
                path(
                    'users/<username>/',
                    EditUserView.as_view(),
                    name='EditUserView'
                ),
            ]
        )
    )
]
