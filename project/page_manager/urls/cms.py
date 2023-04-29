from django.urls import path
from page_manager.views.cms import (CmsFrontend, FrontpageView, CreatePage, EditPage, PageOverview)

# app_name = 'page_manager'

urlpatterns = [
    path('', CmsFrontend.as_view(), name='FrontpageView'),
    # path('page/create/', CreatePage.as_view(), name='CreatePage'),
    # path('page/edit/<int:pk>', EditPage.as_view(), name='EditPage'),
    # path('page/all/', PageOverview.as_view(), name='PageOverview'),
]
