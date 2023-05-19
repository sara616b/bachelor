from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('page_manager.urls')),
    path('', include('login.urls')),
    path('', include('user.urls')),
]
