from django.shortcuts import render
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
