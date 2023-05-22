from django.urls import path
from page_manager.views.cms import (
    FrontpageView,
    PagesView,
    EditPageView,
    CreatePageView,
    EditComponentView
)

urlpatterns = [
    path('', FrontpageView.as_view(), name='FrontpageView'),
    path('pages/', PagesView.as_view(), name='PagesView'),
    path('pages/create/', CreatePageView.as_view(), name='CreatePageView'),
    path('pages/<slug>/', EditPageView.as_view(), name='EditPageView'),
    path(
        'pages/<slug>/component/<component_id>/',
        EditComponentView.as_view(),
        name='EditComponentView'
    ),
]
