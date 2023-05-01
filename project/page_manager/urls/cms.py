from django.urls import path
from page_manager.views.cms import (CmsFrontend)

urlpatterns = [
    path('', CmsFrontend.as_view(), name='FrontpageView'),
    path('page/create/', CmsFrontend.as_view(), name='CreatePage'),
    path('page/all/', CmsFrontend.as_view(), name='PageOverview'),
    path('page/edit/<slug>', CmsFrontend.as_view(), name='EditPage'),
]
