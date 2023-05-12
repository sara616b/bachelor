from django.shortcuts import render
from django.views import View
from page_manager.models import Page
from page_manager.views.api import HTMXGetPage


class PageView(View):
    def get(self, request, slug):
        title = Page.objects.get(slug=slug).title
        page = HTMXGetPage(slug='new-page')
        return render(
            request,
            'website/Pages/Page.html',
            {
                'title': title,
                'page': page,
            }
        )
