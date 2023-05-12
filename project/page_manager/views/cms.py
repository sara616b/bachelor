from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from page_manager.views.api import HTMXGetPages
from page_manager.models import Page
from django.forms.models import model_to_dict
import requests
from page_manager.utils import mongo_client
from django.http import JsonResponse
from bson.json_util import dumps
import json


class FrontpageView(LoginRequiredMixin, View):
    def get(self, request):
        return render(
            request,
            'Cms/Pages/Frontpage.html',
            {
                'title': 'Frontpage | ',
            }
        )


class PagesView(View):
    def get(self, request):
        pages = Page.objects.all()
        return render(
            request,
            'Cms/Pages/Pages.html',
            {
                'title': 'All Pages | ',
                'pages': [model_to_dict(page) for page in pages]
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
        try:
            page = Page.objects.get(slug=slug)
            database = mongo_client.Bachelor
            page_data = database['pages'].find_one({'page_slug': slug})['data']
        except Exception as e:
            return JsonResponse(
                {
                    'data': f'{e}',
                    'status': 500,
                }
            )
        return render(
            request,
            'Cms/Pages/EditPage.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'page_data': json.loads(dumps(page_data)),
                'customization_data': {
                    "Title": {
                        "component": "Title",
                        "values": {
                            "name": "Title",
                            "title_color": "#000",
                            "text": "New Title",
                            "alignment": "center",
                            "bold": "false"
                        },
                        "customization": {
                            "text": {
                                "type": "text",
                                "name": "Title Text"
                            },
                            "title_color": {
                                "type": "color",
                                "name": "Title Color"
                            },
                            "alignment": {
                                "type": "alignment",
                                "name": "Title Alignment"
                            },
                            "bold": {
                                "type": "boolean",
                                "name": "Bold"
                            }
                        }
                    },
                    "Text": {
                        "component": "Text",
                        "values": {
                            "name": "Text",
                            "text_color": "#000",
                            "text": "New Text",
                            "alignment": "center"
                        },
                        "customization": {
                            "text": {
                                "type": "textarea",
                                "name": "Text Text"
                            },
                            "text_color": {
                                "type": "color",
                                "name": "Text Color"
                            },
                            "alignment": {
                                "type": "alignment",
                                "name": "Text Alignment"
                            }
                        }
                    },
                    "Image": {
                        "component": "Image",
                        "values": {
                            "name": "Image",
                            "link": "",
                            "alignment": "center"
                        },
                        "customization": {
                            "link": {
                                "type": "text",
                                "name": "Link"
                            }
                        }
                    }
                }
            }
        )
