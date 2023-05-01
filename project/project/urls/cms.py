from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('login.urls')),
    path('', include('page_manager.urls.cms')),
    path('', include('page_manager.urls.api')),
    path('', include('user.urls')),
]
