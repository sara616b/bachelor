from django.urls import path
from page_manager.views.website import PageView

urlpatterns = [
    path('<slug>/', PageView.as_view(), name='PageView')
]
