from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib.auth.mixins import LoginRequiredMixin
from bson.json_util import dumps, loads
import json
import requests

from page_manager.utils import mongo_client
# from page_manager.models import Page


class GetAllPagesApi(View):
    def get(self, request):
        try:
            database = mongo_client.Bachelor
            pages = database['pages'].find()
            return JsonResponse(
                {
                    'pages': json.loads(dumps(pages)),
                    'status': 200,
                }
            )
        except Exception as e:
            return JsonResponse(
                {
                    'data': f'{e}',
                    'status': 500,
                }
            )


class GetPageApi(View):
    def get(self, request, slug):
        try:
            database = mongo_client.Bachelor
            page = database['pages'].find_one({'page_slug': slug})
        except Exception as e:
            return JsonResponse(
                {
                    'data': f'{e}',
                    'status': 500,
                }
            )

        return JsonResponse(
            {
                'data': json.loads(dumps(page)),
                'status': 200,
            }
        )


class CreateNewPageApi(View, LoginRequiredMixin):
    def post(self, request):
        try:
            database = mongo_client.Bachelor
            pages = database['pages']
            slug = request.POST.get('slug')
            data = {
                'page_title': request.POST.get('title'),
                'page_slug': slug,
                'data': {},
            }

            result = pages.insert_one(data)
            if result.inserted_id:
                return JsonResponse(
                    {
                        'result': 'created',
                        'page_slug': slug,
                    },
                    status=200
                )

        except Exception as ex:
            return JsonResponse(
                {
                    'result': f'error: {ex}',
                },
                status=500
            )


class DeletePageApi(View, LoginRequiredMixin):
    def delete(self, request, slug):
        try:
            database = mongo_client.Bachelor
            pages = database['pages']

            pages.delete_one({'page_slug': slug})
            return JsonResponse({
                'result': 'deleted',
                'page_slug': slug,
                }, status=200)

        except Exception as ex:
            return JsonResponse({
                'result': f'error: {ex}',
                }, status=500)


class UpdatePageApi(View):
    def post(self, request, pk):
        pass
        # try:
        #     page = Page.objects.get(pk=pk)

        #     new_data = json.loads(request.POST.get('page'))

        #     # if page.title != new_data['title']:
        #     #     page.title = new_data['title']
        #     # if page.slug != new_data['slug']:
        #     #     page.slug = new_data['slug']
            
        #     page.page_data = new_data['data']

        #     page.page_title = 'first ever page title'
        #     page.save()

        #     return JsonResponse({
        #         'result': 'updated',
        #         'page_id': page.pk,
        #         }, status=200)
    
        # except:
        #     return JsonResponse({
        #         'result': 'error',
        #         }, status=500)


class UploadImageApi(View, LoginRequiredMixin):
    def post(self, request):
        print('upload')
        print(request.POST.get('image_url'))

        return JsonResponse({
            'result': 'uploaded',
            'image_src': 'slug',
            }, status=200)