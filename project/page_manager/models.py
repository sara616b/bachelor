from django.db import models


class Page(models.Model):
    title = models.CharField(max_length=255, unique=True)
    online = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, unique=True)
    thumbnail_url = models.URLField(max_length=255, blank=True)


class Image(models.Model):
    name = models.CharField(max_length=50, unique=True)
    extension = models.CharField(max_length=10)
    url = models.URLField(max_length=255)
    thumbnail_url = models.URLField(max_length=255, blank=True)
    delete_url = models.URLField(max_length=255, blank=True)
