from django.shortcuts import render, reverse
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect
from page_manager.models import (
    Page,
    Section,
    Component,
    Column,
    ComponentValue,
    SectionValue
)
from django.forms.models import model_to_dict
from page_manager.utils import customization_data
from django.http import JsonResponse
# from bson.json_util import dumps
# import json
from django.db.utils import IntegrityError
from django.contrib import messages


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


class CreatePageView(LoginRequiredMixin, View):
    def get(self, request, **kwargs):
        return render(
            request,
            'Cms/Pages/CreatePage.html',
            {
                'error': request.GET.get('error') if request.GET.get('error') else None,  # noqa
                'title': request.GET.get('title') if request.GET.get('title') else None,  # noqa
                'slug': request.GET.get('slug') if request.GET.get('slug') else None,  # noqa
                'thumbnail_url': request.GET.get('thumbnail_url') if request.GET.get('thumbnail_url') else None,  # noqa
            }
        )

    def post(self, request):
        try:
            title = request.POST['title']
            slug = request.POST['slug']
            thumbnail_url = request.POST['thumbnail']
            Page.objects.create(
                title=title,
                slug=slug,
                thumbnail_url=thumbnail_url,
            )
        except IntegrityError:
            messages.add_message(
                request,
                messages.INFO,
                'Title and slug must be unique! Page not created.'
            )
            return HttpResponseRedirect(
                reverse('CreatePageView') + f"?title={title}&slug={slug}&thumbnail_url={thumbnail_url}"  # noqa
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'An error occured. {e}'
            )
            return HttpResponseRedirect(
                reverse('CreatePageView') + f"?title={title}&slug={slug}&thumbnail_url={thumbnail_url}"  # noqa
            )

        return HttpResponseRedirect(reverse('PagesView'))


class EditPageView(View):
    def get(self, request, slug):
        try:
            page = Page.objects.get(slug=slug)
            sections = Section.objects.select_related(
                'page'
            ).filter(
                page__slug=slug
            )
            # columns = Column.objects.select_related('page').filter(page__slug=slug)  # noqa
            # components = Component.objects.select_related('page', 'column').filter(page__slug=slug)  # noqa
            # componentvalues = ComponentValue.objects.select_related('page').filter(page__slug=slug)  # noqa
            data = [model_to_dict(section) for section in sections]
            for section in data:
                section['values'] = [
                    model_to_dict(value)
                    for value
                    in SectionValue.objects.select_related(
                        'page'
                    ).filter(
                        page__slug=slug,
                        section=section['id']
                    )
                ]
                section['columns'] = [
                    model_to_dict(column)
                    for column
                    in Column.objects.select_related(
                        'page', 'section'
                    ).filter(
                        page__slug=slug,
                        section=section['id']
                    )
                ]
                for column in section['columns']:
                    column['components'] = [
                        model_to_dict(component)
                        for component
                        in Component.objects.select_related(
                            'page', 'column'
                        ).filter(
                            page__slug=slug,
                            column=column['id']
                        )
                    ]
                    for component in column['components']:
                        component['values'] = [
                            model_to_dict(value)
                            for value
                            in ComponentValue.objects.select_related(
                                'page'
                            ).filter(
                                page__slug=slug,
                                component=component['id']
                            )
                        ]
            print(data)
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
                'sections': data,
                'customization_data': customization_data,
            }
        )


class EditComponentView(LoginRequiredMixin, View):
    def put(self, request, slug, component_id):
        print('editing component')
        pass
