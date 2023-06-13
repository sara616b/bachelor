from django.shortcuts import render, redirect
from django.views import View
from django.http import JsonResponse
from page_manager.models import (
    Page,
    # Section,
    # Component,
    # Column,
    # ComponentValue,
    # SectionValue
)
from django.forms.models import model_to_dict
from page_manager.utils import customization_data


class IndexView(View):
    def get(self, request):
        try:
            Page.objects.get(slug='home', online=True)
            return redirect('PageView', slug='home')
        except Page.DoesNotExist:
            slug = Page.objects.filter(online=True)[0].slug
            return redirect('PageView', slug=slug)


class PageView(View):
    def get(self, request, slug, online=True):
        try:
            page = Page.objects.get(slug=slug, online=online)
        except Exception as e:
            return JsonResponse(
                {
                    'data': f'{e}',
                    'status': 404,
                }
            )
        return render(
            request,
            'website/Pages/Page.html',
            {
                'page': model_to_dict(page),
                'sections': page.sections,
                'customization_data': customization_data,
            }
        )
