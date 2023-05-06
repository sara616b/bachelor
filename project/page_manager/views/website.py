from django.shortcuts import render
from django.views import View
from page_manager.models import Page


class WebsiteFrontend(View):
    def get(self, request, **kwargs):
        title = 'Page'
        if 'slug' in kwargs:
            title = Page.objects.get(slug=kwargs.get('slug')).title
        return render(
            request,
            'website/render_bundle_base.html',
            {
                'title': title,
                'bundle_name': 'website_main',
            }
        )


class IndexView(View):
    def get(self, request):
        slug = 'new-page'
        return render(
            request,
            'website/render_bundle_base.html',
            {
                'title': 'Home | ',
                'bundle_name': 'website_page',
                'initial_data': {'slug': slug},
            }
        )
