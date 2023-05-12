from django.urls import path
from page_manager.views.cms import (FrontpageView, PagesView, EditPage)

urlpatterns = [
    path('', FrontpageView.as_view(), name='FrontpageView'),
    path('pages/', PagesView.as_view(), name='PagesView'),
    # path('page/create/', CmsFrontend.as_view(), name='CreatePage'),
    path('pages/<slug>/', EditPage.as_view(), name='EditPage'),
]
