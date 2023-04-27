from django.urls import path
from page_manager.views.cms import (FrontpageView, CreatePage, EditPage, PageOverview)

# app_name = 'page_manager'

urlpatterns = [
    path('', FrontpageView.as_view(), name='FrontpageView'),
    path('page/create/', CreatePage.as_view(), name='CreatePage'),
    path('page/edit/<int:pk>', EditPage.as_view(), name='EditPage'),
    path('page/all/', PageOverview.as_view(), name='PageOverview'),
]
