"""
Django settings for storefront project.

Generated by 'django-admin startproject' using Django 4.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""
from project.settings.common import *
# flake8: noqa

ROOT_URLCONF = 'project.urls.website'

STATIC_URL = 'static/'

TEMPLATES[0]['DIRS'] = [BASE_DIR / 'templates']
