# from django.shortcuts import render
from django.views import View
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from bson.json_util import dumps
import json

from page_manager.utils import mongo_client
from page_manager.models import Page

from django.middleware.csrf import get_token


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
        # TODO - add check if it's online
        try:
            page = Page.objects.get(slug=slug, online=True)
            database = mongo_client.Bachelor
            page_data = database['pages'].find_one({'page_slug': slug})['data']

        except Exception as e:
            return JsonResponse(
                {
                    'data': f'{e}',
                    'status': 500,
                }
            )

        return JsonResponse(
            {
                'data': {
                    'title': page.title,
                    'online': page.online,
                    'slug': page.slug,
                    'thumbnail_url': page.thumbnail_url,
                    'data': json.loads(dumps(page_data))
                },
                'status': 200,
            }
        )


class GetPagePreviewApi(View):
    def get(self, request, slug, **kwargs):
        # TODO - add check if it's online
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
        title = request.POST.get('title')
        slug = request.POST.get('slug')
        try:
            Page.objects.create(
                title=title,
                slug=slug
            )
        except Exception as ex:
            print(ex)
        try:
            database = mongo_client.Bachelor
            pages = database['pages']
            data = {
                'page_title': title,
                'page_slug': slug,
                'data': {
                    'sections': {}
                },
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


class UpdatePageApi(View, LoginRequiredMixin):
    def post(self, request, slug):
        try:
            page = Page.objects.get(slug=slug)

            title = request.POST.get('title')
            new_slug = request.POST.get('slug')
            thumbnail = request.POST.get('thumbnail')
            online = True if request.POST.get('online') == 'true' else False

            if (page.title != title):
                page.title = title
            if (page.slug != new_slug):
                page.slug = new_slug
            if (page.thumbnail_url != thumbnail):
                page.thumbnail_url = thumbnail
            if (page.online != online):
                page.online = online
            page.save()

            database = mongo_client.Bachelor
            pages = database['pages']

            pages.update_one(
                {
                    'page_slug': slug
                },
                {
                    '$set': {
                        'page_title': title,
                        'page_slug': new_slug,
                    }
                }
            )

            return JsonResponse({
                'result': 'updated',
                'page_slug': new_slug,
                }, status=200)

        except Exception as ex:
            return JsonResponse({
                'result': f'error: {ex}',
                }, status=500)


class CreateObjectApi(View):
    def post(self, request, slug, object, name):
        print("CreateObjectApi")
        try:
            database = mongo_client.Bachelor
            pages = database['pages']
            page = pages.find_one({'page_slug': slug})
            object_to_add = json.loads(request.POST.get('object_to_add'))

            if object == 'section':
                current_object_length = len(
                    json.loads(dumps(page['data']['sections']))
                )
                field_to_add_to = f'data.sections.{current_object_length + 1}'

            if object == 'component':
                section_key = request.POST.get('section_key')
                column_key = request.POST.get('column_key')
                current_object_length = len(
                    json.loads(dumps(
                        page['data']['sections'][section_key]['columns'][column_key]['components']  # noqa
                    ))
                )
                field_to_add_to = f'data.sections.{section_key}.columns.{column_key}.components.{current_object_length + 1}'  # noqa

            pages.update_one(
                {
                    'page_slug': slug
                },
                {
                    '$set': {
                        field_to_add_to: object_to_add
                    }
                }
            )

            return JsonResponse({
                'result': 'updated',
                'page_slug': slug,
                }, status=200)

        except Exception as ex:
            return JsonResponse({
                'result': f'error: {ex}',
                }, status=500)


class DeleteObjectApi(View):
    def post(self, request, slug, object, index):
        try:
            database = mongo_client.Bachelor
            pages = database['pages']
            page = pages.find_one({'page_slug': slug})

            if object == 'section':
                current_object_length = len(
                    json.loads(dumps(page['data']['sections']))
                )
                field = 'data.sections'

            if object == 'component':
                section_key = request.POST.get('section_key')
                column_key = request.POST.get('column_key')
                current_object_length = len(
                    json.loads(dumps(
                        page['data']['sections'][section_key]['columns'][column_key]['components']  # noqa
                    ))
                )
                field = f'data.sections.{section_key}.columns.{column_key}.components'  # noqa

            if current_object_length == int(index):
                pages.update_one(
                    {
                        'page_slug': slug
                    },
                    {
                        '$unset': {
                            f'{field}.{index}': ''
                        }
                    }
                )
            else:
                index_to_update = int(index) + 1
                while index_to_update <= current_object_length:
                    pages.update_one(
                        {
                            'page_slug': slug
                        },
                        {
                            '$rename': {
                                f'{field}.{str(index_to_update)}': f'{field}.{str(int(index_to_update)-1)}'  # noqa
                            }
                        }
                    )
                    index_to_update += 1

            return JsonResponse({
                'result': 'deleted',
                'page_slug': slug,
                }, status=200)

        except Exception as ex:
            return JsonResponse({
                'result': f'error: {ex}',
                }, status=500)


class MoveObjectApi(View):
    def post(self, request, slug, object, index, direction):
        try:
            database = mongo_client.Bachelor
            pages = database['pages']

            index_one = index if direction == 'down' else str(int(index) - 1)
            index_two = index if direction == 'up' else str(int(index) + 1)
            page = pages.find_one({
                'page_slug': slug
            })

            if object == 'section':
                field_string = 'data.sections'
                field = page['data']['sections']

            if object == 'component':
                section_key = request.POST.get('section_key')
                column_key = request.POST.get('column_key')
                field_string = f'data.sections.{section_key}.columns.{column_key}.components'  # noqa
                field = page['data']['sections'][section_key]['columns'][column_key]['components']  # noqa

            to_move_up = field[index_two]
            to_move_down = field[index_one]

            pages.update_many(
                    {
                        'page_slug': slug
                    },
                    {
                        '$set': {
                            f'{field_string}.{index_two}': to_move_down,
                            f'{field_string}.{index_one}': to_move_up,
                        }
                    }
            )
            return JsonResponse({
                'result': 'moved',
                'page_slug': slug,
                }, status=200)

        except Exception as ex:
            return JsonResponse({
                'result': f'error: {ex}',
                }, status=500)


class ChangeColumnAmount(View):
    def post(self, request, slug, amount):
        try:
            database = mongo_client.Bachelor
            pages = database['pages']
            section_key = request.POST.get('section_key')

            if amount == '2':
                pages.update_one(
                    {
                        'page_slug': slug
                    },
                    {
                        '$set': {
                            f'data.sections.{section_key}.columns.2': {
                                'components': {}
                            }
                        }
                    }
                )

            if amount == '1':
                pages.update_one(
                    {
                        'page_slug': slug
                    },
                    {
                        '$unset': {
                            f'data.sections.{section_key}.columns.2': ''
                        }
                    }
                )

            return JsonResponse({
                'result': 'updated',
                'page_slug': slug,
                }, status=200)

        except Exception as ex:
            return JsonResponse({
                'result': f'error: {ex}',
                }, status=500)


class UpdateComponentApi(View):
    def post(self, request, slug, index):
        try:
            database = mongo_client.Bachelor
            pages = database['pages']
            object_to_add = json.loads(request.POST.get('object_to_add'))

            section_key = request.POST.get('section_key')
            column_key = request.POST.get('column_key')
            field_to_add_to = f'data.sections.{section_key}.columns.{column_key}.components.{index}'  # noqa

            pages.update_one(
                {
                    'page_slug': slug
                },
                {
                    '$set': {
                        field_to_add_to: object_to_add
                    }
                }
            )

            return JsonResponse({
                'result': 'updated',
                'page_slug': slug,
                }, status=200)

        except Exception as ex:
            return JsonResponse({
                'result': f'error: {ex}',
                }, status=500)


class UpdateSectionApi(View):
    def post(self, request, slug, index):
        try:
            database = mongo_client.Bachelor
            pages = database['pages']
            background_color = request.POST.get('background_color')
            wrap_reverse = request.POST.get('wrap_reverse')

            pages.update_one(
                {
                    'page_slug': slug
                },
                {
                    '$set': {
                        f'data.sections.{index}.background_color': background_color,  # noqa
                        f'data.sections.{index}.wrap_reverse': wrap_reverse,
                    }
                }
            )

            return JsonResponse({
                'result': 'updated',
                'page_slug': slug,
                }, status=200)

        except Exception as ex:
            return JsonResponse({
                'result': f'error: {ex}',
                }, status=500)


class UploadImageApi(View, LoginRequiredMixin):
    def post(self, request):
        print('upload')
        print(request.POST.get('image_url'))

        return JsonResponse({
            'result': 'uploaded',
            'image_src': 'slug',
            }, status=200)


class CsrfTokenView(View):
    """Send to the login interface the token CSRF as a cookie."""

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        """Return a empty response with the token CSRF.

        Returns
        -------
        Response
            The response with the token CSRF as a cookie.
        """
        return HttpResponse(status=204)


class csrf(View):
    def get(self, request):
        return JsonResponse({'csrfToken': get_token(request)})

    def post(self, request):
        return JsonResponse({'csrfToken': get_token(request)})


class PingApi(View):
    def get(self, request):
        return JsonResponse({'result': 'OK'})

    def post(self, request):
        return JsonResponse({'result': 'OK'})
