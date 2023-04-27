from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
import json
from django.views.decorators.csrf import ensure_csrf_cookie
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
from bson.json_util import dumps, loads

from django.views.decorators.csrf import csrf_protect

from pagemanager.models import Page
from project.settings.secrets import MONGO_PASSWORD


mongo_client = MongoClient(
    f'mongodb+srv://sarah:{quote_plus(MONGO_PASSWORD)}@bachelor.rjkfkr1.mongodb.net/?retryWrites=true&w=majority',
    server_api=ServerApi('1')
)


class GetAllPagesApi(View):
    def get(self, request):
        try:
            pages = Page.objects.all().values(
                'page_title',
                'pk'
            )
        except Page.DoesNotExist:
            return JsonResponse({
                'result': 'no pages found'
            }, status=404)

        return JsonResponse(
            data={'pages': list(pages)},
            status=200
        )


class GetPageApi(View):
    def get(self, request, slug):        
        try:
            database = mongo_client.Bachelor
            page = database['pages'].find_one({'page_slug': slug})
        except Exception as e:
            print(e)

        return JsonResponse(
            {
                'data': json.loads(dumps(page)),
                'status': 200,
                'safe': False,
            }
        )


class CreateNewPageApi(View):
    def post(self, request):
        new_page = Page.objects.create(
            page_title = request.POST.get('title'),
            slug = request.POST.get('slug'),
        )

        if new_page:
            return JsonResponse({
                'result': 'created',
                'page_id': new_page.pk,
                }, status=200)
        else:
            return JsonResponse({
                'result': 'error',
                }, status=500)


class UpdatePageApi(View):
    def post(self, request, pk):
        try:
            page = Page.objects.get(pk=pk)

            new_data = json.loads(request.POST.get('page'))

            # if page.title != new_data['title']:
            #     page.title = new_data['title']
            # if page.slug != new_data['slug']:
            #     page.slug = new_data['slug']
            
            page.page_data = new_data['data']

            page.page_title = 'first ever page title'
            page.save()

            return JsonResponse({
                'result': 'updated',
                'page_id': page.pk,
                }, status=200)
    
        except:
            return JsonResponse({
                'result': 'error',
                }, status=500)
