from django.urls import path
from page_manager.views.website import (WebsiteFrontend)

urlpatterns = [
    path('', WebsiteFrontend.as_view(), name='FrontpageView'),
    path('<slug>/', WebsiteFrontend.as_view(), name='FrontpageView'),
    path('<slug>/preview/', WebsiteFrontend.as_view(), name='FrontpageView'),
    # path('', IndexView.as_view(), name='IndexView'),
]
