from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('cms/admin/', admin.site.urls),
    path('', include('login.urls')),
    path('', include('page_manager.urls.cms')),
    # path('', include('page_manager.urls.api')),
    path('', include('user.urls')),
]
