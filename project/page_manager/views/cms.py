from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
# from pagemanager.models import Page


class FrontpageView(LoginRequiredMixin, View):
    def get(self, request):
        return render(
            request,
            'cms/render_bundle_base.html',
            {
                'title': 'Frontpage | ',
                'bundle_name': 'cms_frontpage',
            }
        )


class CreatePage(View):
    def get(self, request):
        return render(
            request,
            'cms/render_bundle_base.html',
            {
                'title': 'Create New Page | ',
                'bundle_name': 'cms_page_create',
            }
        )


class EditPage(View):
    def get(self, request, pk):
        return render(
            request,
            'cms/render_bundle_base.html',
            {
                'title': 'Edit Page | ',
                'bundle_name': 'cms_page_edit',
                'initial_data': {'id': pk}
            }
        )


class PageOverview(View):
    def get(self, request):
        return render(
            request,
            'cms/render_bundle_base.html',
            {
                'title': 'All Pages | ',
                'bundle_name': 'cms_page_overview',
            }
        )
