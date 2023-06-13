from django.shortcuts import render, reverse
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect
from django.db import transaction
from page_manager.models import (
    Page,
    Section,
    Component,
    Column,
    ComponentValue,
    SectionValue,
    Image
)
from django.forms.models import model_to_dict
from page_manager.utils import customization_data, get_put_data
import json
from django.db.utils import IntegrityError
from django.contrib import messages
import requests
import base64
from django.core.paginator import Paginator


class FrontpageView(LoginRequiredMixin, View):
    def get(self, request):
        return render(
            request,
            'Cms/Pages/Frontpage.html',
            {
                'title': 'Frontpage | ',
            }
        )


class PagesView(LoginRequiredMixin, View):
    def get(self, request):
        pages = [
            model_to_dict(page)
            for page
            in Page.objects.all().order_by('-online', 'title')
        ]
        paginator = Paginator(pages, 5)

        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(
            request,
            'Cms/Pages/Pages.html',
            {
                'title': 'All Pages | ',
                'pages': page_obj
            }
        )


class CreatePageView(LoginRequiredMixin, View):
    def get(self, request):
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
        if 'page_manager.add_page' not in request.user.get_user_permissions():
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You don't have permission to create pages."
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        try:
            title = request.POST['title']
            slug = request.POST['slug']
            thumbnail_url = request.POST['thumbnail']
            Page.objects.create(
                title=title,
                slug=slug,
                thumbnail_url=thumbnail_url,
            )
            messages.add_message(
                request,
                messages.INFO,
                "Page created!"
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


class EditPageView(LoginRequiredMixin, View):
    def get(self, request, slug):
        try:
            page = Page.objects.get(slug=slug)
        except Page.DoesNotExist:
            messages.add_message(
                request,
                messages.INFO,
                'Page not found. Please try again.'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )
        return render(
            request,
            'Cms/Pages/EditPage.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'sections': page.sections,
                'customization_data': customization_data,
            }
        )

    def put(self, request, slug):
        if 'page_manager.change_page' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You don't have permission to edit pages."
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        try:
            page = Page.objects.get(slug=slug)

            request = get_put_data(request)

            new_title = request.PUT.get('title')
            new_slug = request.PUT.get('slug')
            new_thumbnail = request.PUT.get('thumbnail')
            new_online = True if request.PUT.get('online') == 'on' else False

            if (page.title != new_title):
                page.title = new_title
            if (page.slug != new_slug):
                page.slug = new_slug
            if (page.thumbnail_url != new_thumbnail):
                page.thumbnail_url = new_thumbnail
            if (page.online != new_online):
                page.online = new_online
            page.save()
            messages.add_message(
                request,
                messages.INFO,
                "Page updated!"
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'Something went wrong. Error: {e}'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )

        return render(
            request,
            'Cms/Modules/EditPageForm.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'sections': page.sections,
                'customization_data': customization_data,
            }
        )


class DeletePageView(LoginRequiredMixin, View):
    def delete(self, request, slug):
        if 'page_manager.delete_page' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You don't have permission to delete pages."
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        try:
            Page.objects.get(slug=slug).delete()
            messages.add_message(
                request,
                messages.INFO,
                "Page deleted."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f"Something went wrong. Please try again. ({e})"
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )
        return render(
            request,
            'Cms/Modules/Empty.html',
            {}
        )


class CreateSectionView(LoginRequiredMixin, View):
    def post(self, request, slug):
        if 'page_manager.add_section' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                'Permission denied. You are not allowed to create sections.'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        try:
            name = request.POST['new_name']
            page = Page.objects.get(slug=slug)
            amount_of_section = len(page.sections)
            with transaction.atomic():
                section = Section.objects.create(
                    page=page,
                    order=amount_of_section + 1,
                    name=name,
                )
                SectionValue.objects.bulk_create(
                    [
                        SectionValue(
                            page=page,
                            section=section,
                            key="wrap_reverse",
                            value=False
                        ),
                        SectionValue(
                            page=page,
                            section=section,
                            key="background_color",
                            value="#fff"
                        ),
                        SectionValue(
                            page=page,
                            section=section,
                            key="background_image",
                            value=""
                        ),
                    ]
                )
                Column.objects.create(
                    page=page,
                    order=1,
                    section=section,
                )
            messages.add_message(
                request,
                messages.INFO,
                "Section created."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'An error occured. {e}'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )

        return HttpResponseRedirect(reverse(
            'EditPageView',
            kwargs={'slug': slug}
        ))


class EditSectionView(LoginRequiredMixin, View):
    def delete(self, request, slug, section_id):
        if 'page_manager.delete_section' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                'Permission denied. You are not allowed to delete sections.'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        try:
            page = Page.objects.get(slug=slug)
            section = Section.objects.get(id=section_id)
            with transaction.atomic():
                order = section.order
                section.delete()
                sections = Section.objects.filter(order__gte=order)
                for section in sections:
                    section.order = section.order - 1
                Section.objects.bulk_update(sections, ['order'])
            messages.add_message(
                request,
                messages.INFO,
                "Section deleted."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'An error occured. {e}'
            )
            return HttpResponseRedirect(
                reverse('EditPageView', kwargs={'slug': slug})
            )
        return render(
            request,
            'Cms/Pages/EditPage.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'sections': page.sections,
                'customization_data': customization_data,
            }
        )

    def put(self, request, slug, section_id):
        if 'page_manager.change_section' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You don't have permission to edit sections."  # noqa
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        try:
            page = Page.objects.get(slug=slug)
            section = Section.objects.get(id=section_id)
            request = get_put_data(request)
            sectionvalues = SectionValue.objects.filter(section=section)

            for value in sectionvalues:
                if request.PUT.get(f'{value.key}{section.order}') == 'on':
                    value.value = True
                elif request.PUT.get(f'{value.key}{section.order}') == "":
                    value.value = ""
                elif not request.PUT.get(f'{value.key}{section.order}'):
                    value.value = False
                else:
                    value.value = request.PUT.get(
                        f'{value.key}{section.order}'
                    )
            SectionValue.objects.bulk_update(sectionvalues, ['value'])
            messages.add_message(
                request,
                messages.INFO,
                "Section updated."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f"Something went wrong. Error: {e}"
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )

        return render(
            request,
            'Cms/Pages/EditPage.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'sections': page.sections,
                'customization_data': customization_data,
            }
        )


class DeleteSectionView(LoginRequiredMixin, View):
    def delete(self, request, slug, section_id):
        page = Page.objects.get(slug=slug)
        if 'page_manager.delete_section' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                'Permission denied. You are not allowed to delete sections.'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        else:
            try:
                section = Section.objects.get(pk=section_id)
                with transaction.atomic():
                    order = section.order
                    section.delete()
                    sections = Section.objects.filter(
                        page=page,
                        order__gte=order
                    ).order_by('order')
                    for section in sections:
                        print(section.order)
                        section.order = section.order - 1
                        section.save()
                messages.add_message(
                    request,
                    messages.INFO,
                    "Section deleted."
                )
            except Exception as e:
                messages.add_message(
                    request,
                    messages.INFO,
                    f'Something went wrong. Please try again. (Error: {e})'
                )
                return render(
                    request,
                    'Cms/Modules/MessagesList.html',
                    {},
                    None,
                    500
                )
        page.refresh_from_db()
        return render(
            request,
            'Cms/Pages/EditPage.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'sections': page.sections,
                'customization_data': customization_data,
            }
        )


class CreateComponentView(LoginRequiredMixin, View):
    def post(self, request, slug, section_id, column_id):
        if 'page_manager.add_component' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                'Permission denied. You are not allowed to create components.'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        try:
            name = request.POST['name']
            page = Page.objects.get(slug=slug)
            column = Column.objects.get(id=column_id, section=section_id)
            amount_of_columns = len(Component.objects.filter(column=column_id))
            data = customization_data[name]['values']
            with transaction.atomic():
                component = Component.objects.create(
                    page=page,
                    column=column,
                    order=amount_of_columns + 1,
                    name=name,
                )
                ComponentValue.objects.bulk_create(
                    [
                        ComponentValue(
                            page=page,
                            component=component,
                            key=key,
                            value=data[key]
                        )
                        for key
                        in data
                    ]
                )
            messages.add_message(
                request,
                messages.INFO,
                "Component created."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'Something went wrong. Please try again! Error: {e}'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )
        page.refresh_from_db()
        section_data = {}
        for section_dict in page.sections:
            if int(section_dict['id']) == int(section_id):
                section_data = section_dict
        column_data = {}
        for column_dict in section_data['columns']:
            if int(column_dict['id']) == int(column_id):
                column_data = column_dict
        return render(
            request,
            'Cms/Modules/ComponentList.html',
            {
                'page': model_to_dict(page),
                'sections': page.sections,
                'column': column_data,
                'customization_data': customization_data,
            }
        )


class DeleteComponentView(LoginRequiredMixin, View):
    def delete(self, request, component_id):
        component = Component.objects.get(id=component_id)
        column = component.column
        page = component.page
        if 'page_manager.delete_component' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                'Permission denied. You are not allowed to delete components.'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        else:
            try:
                with transaction.atomic():
                    order = component.order
                    component.delete()
                    components = Component.objects.filter(
                        page=page,
                        column=column,
                        order__gte=order
                    )
                    for component in components:
                        component.order = component.order - 1
                    Component.objects.bulk_update(components, ['order'])
                messages.add_message(
                    request,
                    messages.INFO,
                    "Component deleted."
                )
            except Exception as e:
                messages.add_message(
                    request,
                    messages.INFO,
                    f'Something went wrong. Please try again! Error: {e}'
                )
                return render(
                    request,
                    'Cms/Modules/MessagesList.html',
                    {},
                    None,
                    500
                )
        page.refresh_from_db()
        section_data = {}
        for section in page.sections:
            if section['id'] == column.section.id:
                section_data = section
        column_data = {}
        for column_dict in section_data['columns']:
            if column_dict['id'] == column.id:
                column_data = column_dict
        return render(
            request,
            'Cms/Modules/ColumnEdit.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'section': section_data,
                'column': column_data,
                'customization_data': customization_data,
            }
        )


class EditComponentView(LoginRequiredMixin, View):
    def put(self, request, slug, component_id):
        if 'page_manager.change_component' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You don't have permission to edit components."  # noqa
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        try:
            page = Page.objects.get(slug=slug)
            component = Component.objects.get(id=component_id)
            request = get_put_data(request)
            componentvalues = ComponentValue.objects.filter(
                component=component
            )

            for value in componentvalues:
                if request.PUT.get(f'{value.key}') == 'on':
                    value.value = True
                elif not request.PUT.get(f'{value.key}'):
                    value.value = False
                else:
                    value.value = request.PUT.get(f'{value.key}')
            ComponentValue.objects.bulk_update(componentvalues, ['value'])
            messages.add_message(
                request,
                messages.INFO,
                "Component updated."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f"Something went wrong. Error: {e}"
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )

        page.refresh_from_db()
        # section_data = {}
        column_data = {}
        for section_dict in page.sections:
            for column_dict in section_dict['columns']:
                if int(column_dict['id']) == int(component.column.id):
                    column_data = column_dict
        component_data = {}
        for component_dict in column_data['components']:
            if int(component_dict['id']) == int(component_id):
                component_data = component_dict
        return render(
            request,
            'Cms/Modules/ComponentForm.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'component': component_data,
                'column': column_data,
                'customization_data': customization_data,
            }
        )


class ToggleColumnAmountView(LoginRequiredMixin, View):
    def post(self, request, slug, section_id):
        if 'page_manager.change_column' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                'Permission denied. You are not allowed to update column amounts.'  # noqa
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        page = Page.objects.get(slug=slug)
        try:
            section = Section.objects.get(pk=section_id)
            columns = Column.objects.filter(page=page, section=section)

            if len(columns) == 2:
                for column in columns:
                    if int(column.order) == 2:
                        column.delete()
            elif len(columns) == 1:
                Column.objects.create(page=page, section=section, order=2)
            messages.add_message(
                request,
                messages.INFO,
                "Column amount updated."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'Something went wrong. Please try again. (Error: {e})'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )
        page.refresh_from_db()
        section_data = {}
        for section in page.sections:
            if int(section['id']) == int(section_id):
                section_data = section
        return render(
            request,
            'Cms/Modules/ColumnEdit.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'sections': page.sections,
                'section': section_data,
                'customization_data': customization_data,
            }
        )


class MoveSectionView(LoginRequiredMixin, View):
    def post(self, request, slug, section_id, direction):
        if 'page_manager.change_section' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You don't have permission to edit sections."  # noqa
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        page = Page.objects.get(slug=slug)
        try:
            section = Section.objects.get(pk=section_id)
            with transaction.atomic():
                order = section.order
                section.order = 0
                section.save(update_fields=['order'])
                if direction == "up":
                    section_to_switch = Section.objects.get(
                        page=page,
                        order=int(order)-1
                    )
                    if order-1 != 0 and order <= len(
                        Section.objects.filter(page=page)
                    ):
                        section_to_switch.order = order
                        section.order = order-1
                    else:
                        messages.add_message(
                            request,
                            messages.INFO,
                            'Something went wrong.'
                        )
                if direction == "down":
                    section_to_switch = Section.objects.get(
                        page=page,
                        order=int(order)+1
                    )
                    if order != 0 and order+1 <= len(
                        Section.objects.filter(
                            page=page
                        )
                    ):
                        section_to_switch.order = order
                        section.order = order+1
                    else:
                        messages.add_message(
                            request,
                            messages.INFO,
                            'Something went wrong.'
                        )
                section_to_switch.save(update_fields=['order'])
                section.save(update_fields=['order'])

            messages.add_message(
                request,
                messages.INFO,
                "Section order updated."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'Something went wrong. Please try again. (Error: {e})'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )
        page.refresh_from_db()
        return render(
            request,
            'Cms/Pages/EditPage.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'sections': page.sections,
                'customization_data': customization_data,
            }
        )


class MoveComponentView(LoginRequiredMixin, View):
    def post(self, request, slug, component_id, direction):
        if 'page_manager.change_component' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You don't have permission to edit components."  # noqa
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        page = Page.objects.get(slug=slug)
        component = Component.objects.get(pk=component_id)
        column = component.column
        try:
            with transaction.atomic():
                order = component.order
                component.order = 0
                component.save(update_fields=['order'])
                if direction == "up":
                    component_to_switch = Component.objects.get(
                        page=page,
                        order=int(order)-1,
                        column=column
                    )
                    if order-1 != 0 and order <= len(Component.objects.filter(page=page)):  # noqa
                        component_to_switch.order = order
                        component.order = order-1
                    else:
                        messages.add_message(
                            request,
                            messages.INFO,
                            'Something went wrong.'
                        )
                if direction == "down":
                    component_to_switch = Component.objects.get(
                        page=page,
                        order=int(order)+1,
                        column=column
                    )
                    if order != 0 and order+1 <= len(Component.objects.filter(page=page)):  # noqa
                        component_to_switch.order = order
                        component.order = order+1
                    else:
                        messages.add_message(
                            request,
                            messages.INFO,
                            'Something went wrong.'
                        )
                component_to_switch.save(update_fields=['order'])
                component.save(update_fields=['order'])

            messages.add_message(
                request,
                messages.INFO,
                "Component order updated."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'Something went wrong. Please try again. (Error: {e})'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )
        page.refresh_from_db()
        section_data = {}
        for section in page.sections:
            if section['id'] == component.column.section.id:
                section_data = section
        column_data = {}
        for column_dict in section_data['columns']:
            if column_dict['id'] == component.column.id:
                column_data = column_dict
        return render(
            request,
            'Cms/Modules/ColumnEdit.html',
            {
                'title': 'Edit Page | ',
                'page': model_to_dict(page),
                'section': section_data,
                'column': column_data,
                'customization_data': customization_data,
            }
        )


class UploadImageView(LoginRequiredMixin, View):
    def post(self, request):
        if 'page_manager.add_image' not in request.user.get_user_permissions():
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You're not allowed to upload images."
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        try:
            file = base64.standard_b64encode(request.FILES['image'].read())
            res = requests.post(
                'https://api.imgbb.com/1/upload',
                data={
                   'key': '61bf5339efd0f697d130a299c4c0cc02',
                   'image': file
                }
            )
            if res.status_code != 200:
                messages.add_message(
                    request,
                    messages.INFO,
                    "Something went wrong. Did you choose an image?"
                )
            else:
                try:
                    data = json.loads(res._content.decode())["data"]
                    with transaction.atomic():
                        Image.objects.create(
                            name=f'{request.POST.get("image_name")} {data["height"]}x{data["width"]}',  # noqa
                            url=data["display_url"]
                        )
                        Image.objects.create(
                            name=f'{request.POST.get("image_name")} thumbnail',
                            url=data["thumb"]["url"]
                        )
                except Exception as e:
                    messages.add_message(
                        request,
                        messages.INFO,
                        f'Something went wrong. Please try again. (Error: {e})'
                    )
                    return render(
                        request,
                        'Cms/Modules/MessagesList.html',
                        {},
                        None,
                        500
                    )
            messages.add_message(
                request,
                messages.INFO,
                "New image uploaded."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'Something went wrong. Please try again. (Error: {e})'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )
        if request.path == '/images/':
            images = Image.objects.all().values()
            return render(
                request,
                'Cms/Pages/Images.html',
                {
                    'title': 'All Images | ',
                    'images': images,
                }
            )
        return render(
            request,
            'Cms/Modules/AddImageForm.html',
            {}
        )

    def get(self, request):
        try:
            images = Image.objects.all().values()
            paginator = Paginator(images, 5)

            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'Something went wrong. Please try again. (Error: {e})'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )
        return render(
            request,
            'Cms/Pages/Images.html',
            {
                'title': 'All Images | ',
                'images': page_obj,
            }
        )


class DeleteImageView(LoginRequiredMixin, View):
    def delete(self, request, image_id):
        if 'page_manager.delete_image' not in request.user.get_user_permissions():  # noqa
            messages.add_message(
                request,
                messages.INFO,
                "Permission denied. You're not allowed to delete images."
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                403
            )
        try:
            Image.objects.get(id=image_id).delete()
            messages.add_message(
                request,
                messages.INFO,
                "Image deleted."
            )
        except Exception as e:
            messages.add_message(
                request,
                messages.INFO,
                f'Something went wrong. Please try again. (Error: {e})'
            )
            return render(
                request,
                'Cms/Modules/MessagesList.html',
                {},
                None,
                500
            )
        images = Image.objects.all().values()
        return render(
            request,
            'Cms/Pages/Images.html',
            {
                'title': 'All Images | ',
                'images': images,
            }
        )
