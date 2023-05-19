from django.views import View
from django.http import JsonResponse
from django.http.multipartparser import MultiPartParser
from django.contrib.auth.mixins import LoginRequiredMixin

from bson.json_util import dumps
import json

from page_manager.utils import mongo_client
from page_manager.models import Page, Image


class GetAllPagesApi(LoginRequiredMixin, View):
    def get(self, request):
        try:
            database = mongo_client.Bachelor
            pages_objects = Page.objects.all().values()
            for page in pages_objects:
                data = json.loads(dumps(
                    database['pages'].find_one(
                        {'page_slug': page['slug']}
                    )['data'])
                )
                page['data'] = data

            return JsonResponse(
                {
                    'pages': json.loads(dumps(pages_objects)),
                }, status=200
            )
        except Exception as e:
            return JsonResponse(
                {
                    'data': f'{e}',
                    'status': 500,
                }
            )


class PageApi(LoginRequiredMixin, View):
    def get(self, request, slug):
        try:
            page = Page.objects.get(slug=slug)
            database = mongo_client.Bachelor
            page_data = database['pages'].find_one({'page_slug': slug})['data']

        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
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
                'result': 'success'
            }, status=200
        )

    def post(self, request, slug):
        if 'page_manager.add_page' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        title = request.POST.get('title')
        try:
            Page.objects.create(
                title=title,
                slug=slug
            )
        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

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
                        'slug': slug,
                    }, status=200
                )

        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

    def delete(self, request, slug):
        if 'page_manager.delete_page' not in request.user.get_user_permissions():  # noqa
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            Page.objects.get(slug=slug).delete()

            database = mongo_client.Bachelor
            pages = database['pages']
            pages.delete_one({'page_slug': slug})
        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

        return JsonResponse(
            {
                'result': 'deleted',
                'page_slug': slug,
            }, status=200
        )

    def put(self, request, slug):
        if 'page_manager.edit_page' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            page = Page.objects.get(slug=slug)

            PUT = MultiPartParser(
                request.META, request, request.upload_handlers
            ).parse()[0]

            new_title = PUT.get('title')
            new_slug = PUT.get('slug')
            new_thumbnail = PUT.get('thumbnail')
            new_online = True if PUT.get('online') == 'true' else False

            if (page.title != new_title):
                page.title = new_title
            if (page.slug != new_slug):
                page.slug = new_slug
            if (page.thumbnail_url != new_thumbnail):
                page.thumbnail_url = new_thumbnail
            if (page.online != new_online):
                page.online = new_online
            page.save()

            database = mongo_client.Bachelor
            pages = database['pages']

            pages.update_one(
                {
                    'page_slug': slug
                },
                {
                    '$set': {
                        'page_title': new_title,
                        'page_slug': new_slug,
                    }
                }
            )
        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

        return JsonResponse(
            {
                'result': 'updated',
                'page_slug': new_slug,
            }, status=200
        )


class GetPageApi(View):
    def get(self, request, slug, **kwargs):
        try:
            page = Page.objects.get(slug=slug, online=True)
            database = mongo_client.Bachelor
            page_data = database['pages'].find_one({'page_slug': slug})['data']

        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
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
                'result': 'success'
            }, status=200
        )


class GetPagePreviewApi(View):
    def get(self, request, slug, **kwargs):
        try:
            page = Page.objects.get(slug=slug)
            database = mongo_client.Bachelor
            page_data = database['pages'].find_one({'page_slug': slug})['data']

        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
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
                'result': 'success'
            }, status=200
        )


class PageDataApi(LoginRequiredMixin, View):
    def put(self, request, slug, object, index):
        if 'page_manager.edit_page' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            PUT = MultiPartParser(
                request.META, request, request.upload_handlers
            ).parse()[0]

            database = mongo_client.Bachelor
            pages = database['pages']
            page = pages.find_one({'page_slug': slug})
            object_to_add = json.loads(PUT.get('object_to_add'))

            if object == 'section':
                current_object_length = len(
                    json.loads(dumps(page['data']['sections']))
                )
                field_to_add_to = f'data.sections.{current_object_length + 1}'

            if object == 'component':
                section_key = PUT.get('section_key')
                column_key = PUT.get('column_key')
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
        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

        return JsonResponse(
            {
                'result': 'updated',
                'page_slug': slug,
            }, status=200
        )

    def delete(self, request, slug, object, index):
        if 'page_manager.delete_page' not in request.user.get_user_permissions():  # noqa
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            DELETE = MultiPartParser(
                request.META, request, request.upload_handlers
            ).parse()[0]

            database = mongo_client.Bachelor
            pages = database['pages']
            page = pages.find_one({'page_slug': slug})

            if object == 'section':
                current_object_length = len(
                    json.loads(dumps(page['data']['sections']))
                )
                field = 'data.sections'

            if object == 'component':
                section_key = DELETE.get('section_key')
                column_key = DELETE.get('column_key')
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
        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

        return JsonResponse(
            {
                'result': 'deleted',
                'page_slug': slug,
            }, status=200
        )


class MovePageObjectApi(View):
    def put(self, request, slug, object, index, direction):
        if 'page_manager.edit_page' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            PUT = MultiPartParser(
                request.META, request, request.upload_handlers
            ).parse()[0]

            index_one = index if direction == 'down' else str(int(index) - 1)
            index_two = index if direction == 'up' else str(int(index) + 1)

            database = mongo_client.Bachelor
            pages = database['pages']
            page = pages.find_one({
                'page_slug': slug
            })

            if object == 'section':
                field_string = 'data.sections'
                field = page['data']['sections']

            if object == 'component':
                section_key = PUT.get('section_key')
                column_key = PUT.get('column_key')
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
        except Exception as e:
            return JsonResponse({
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

        return JsonResponse(
            {
                'result': 'moved',
                'page_slug': slug,
            }, status=200
        )


class ChangeColumnAmount(View):
    def put(self, request, slug, amount):
        if 'page_manager.edit_page' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            PUT = MultiPartParser(
                request.META, request, request.upload_handlers
            ).parse()[0]

            database = mongo_client.Bachelor
            pages = database['pages']
            section_key = PUT.get('section_key')

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
        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

        return JsonResponse(
            {
                'result': 'updated',
                'page_slug': slug,
            }, status=200
        )


class UpdateComponentApi(View):
    def put(self, request, slug, index):
        if 'page_manager.edit_page' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            PUT = MultiPartParser(
                request.META, request, request.upload_handlers
            ).parse()[0]

            database = mongo_client.Bachelor
            pages = database['pages']

            object_to_add = json.loads(PUT.get('object_to_add'))
            section_key = PUT.get('section_key')
            column_key = PUT.get('column_key')
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
        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

        return JsonResponse(
            {
                'result': 'updated',
                'page_slug': slug,
            }, status=200
        )


class UpdateSectionApi(View):
    def put(self, request, slug, index):
        if 'page_manager.edit_page' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            PUT = MultiPartParser(
                request.META, request, request.upload_handlers
            ).parse()[0]

            database = mongo_client.Bachelor
            pages = database['pages']
            background_color = PUT.get('background_color')
            wrap_reverse = PUT.get('wrap_reverse')

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
        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

        return JsonResponse(
            {
                'result': 'updated',
                'page_slug': slug,
            }, status=200
        )


class UploadImageApi(View, LoginRequiredMixin):
    def post(self, request):
        if 'page_manager.add_image' not in request.user.get_user_permissions():
            return JsonResponse(
                {
                    'result': 'permission denied',
                }, status=403
            )
        try:
            name = request.POST.get('name')
            url = request.POST.get('url')
            Image.objects.create(name=name, url=url)
        except Exception as e:
            return JsonResponse(
                {
                    'result': 'error',
                    'error': f'{e}',
                }, status=500
            )

        return JsonResponse(
            {
                'result': 'uploaded',
                'image_src': url,
            }, status=200
        )

    def get(self, request):
        try:
            images = Image.objects.all().values()
            return JsonResponse(
                {
                    'images': json.loads(dumps(images)),
                }, status=200
            )
        except Exception as e:
            return JsonResponse(
                {
                    'data': f'{e}',
                    'status': 500,
                }
            )
