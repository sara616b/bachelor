from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
# from pagemanager.models import Page


class CmsFrontend(LoginRequiredMixin, View):
    def get(self, request, **kwargs):
        return render(
            request,
            'cms/render_bundle_base.html',
            {
                'title': 'CMS',
                'bundle_name': 'cms_main',
            }
        )


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
    def get(self, request, slug):
        return render(
            request,
            'cms/render_bundle_base.html',
            {
                'title': 'Edit Page | ',
                'bundle_name': 'cms_page_edit',
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
