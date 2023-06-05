from django.urls import path
from page_manager.views.website import PageView, IndexView

urlpatterns = [
    path('', IndexView.as_view(), name='IndexView'),
    path('<slug>/', PageView.as_view(), name='PageView')
]
