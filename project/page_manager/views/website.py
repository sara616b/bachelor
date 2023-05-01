from django.shortcuts import render
from django.views import View


class WebsiteFrontend(View):
    def get(self, request, **kwargs):
        return render(
            request,
            'website/render_bundle_base.html',
            {
                'title': 'Page',
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
