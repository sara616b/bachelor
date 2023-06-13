from django.test import TestCase
from django.urls import reverse

from page_manager.models import Page
from django.contrib.auth.models import User
from django.db import transaction
from django.template import Context, Template


class TestFrontpageView(TestCase):
    @classmethod
    def setUpTestData(self):
        # create super user to be able to login and have all permissions
        password = 'adminpassword1234##'
        User.objects.create_superuser(
            username='admin',
            email='admin@admin.com',
            password=password,
        )

    def tearDown(self):
        User.objects.get(username='admin').delete()

    def test_not_logged_in_redirect_passes(self):
        response = self.client.get('/cms/')
        self.assertRedirects(response, '/cms/login/?next=/cms/')

    def test_url_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get('/cms/')

        self.assertEqual(str(response.context['user']), 'admin')
        self.assertEqual(response.status_code, 200)

    def test_url_from_name_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get(reverse('FrontpageView'))
        self.assertEqual(response.status_code, 200)

    def test_template_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get(reverse('FrontpageView'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'Cms/Pages/Frontpage.html')


class TestCreatePageView(TestCase):
    @classmethod
    def setUpTestData(self):
        # create super user to be able to login and have all permissions
        password = 'adminpassword1234##'
        User.objects.create_superuser(
            username='admin',
            email='admin@admin.com',
            password=password,
        )
        User.objects.create_user(
            username='test',
            email='test@test.com',
            password='test',
        )
        Page.objects.create(
            title="dublicate",
            slug="dublicate",
        )

    def tearDown(self):
        User.objects.get(username='admin').delete()
        User.objects.get(username='test').delete()

    def test_not_logged_in_redirect_passes(self):
        response = self.client.get('/cms/pages/create/')
        self.assertRedirects(response, '/cms/login/?next=/cms/pages/create/')

    def test_url_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get('/cms/pages/create/')

        self.assertEqual(str(response.context['user']), 'admin')
        self.assertEqual(response.status_code, 200)

    def test_url_from_name_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get(reverse('CreatePageView'))
        self.assertEqual(response.status_code, 200)

    def test_template_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get(reverse('CreatePageView'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'Cms/Pages/CreatePage.html')

    def test_post_no_permission(self):
        self.client.login(username='test', password='test')
        response = self.client.post(reverse('CreatePageView'))
        self.assertEqual(response.status_code, 403)
        self.assertTemplateUsed(response, 'Cms/Modules/MessagesList.html')

    def test_create_page(self):
        self.client.login(username='admin', password='adminpassword1234##')
        data = {
            'title': 'title',
            'slug': 'slug',
            'thumbnail': ''
        }
        response = self.client.post(reverse('CreatePageView'), data)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('PagesView'))

    def test_cannot_create_dublicated_page(self):
        self.client.login(username='admin', password='adminpassword1234##')
        data = {
            'title': 'dublicate',
            'slug': 'dublicate',
            'thumbnail': ''
        }
        with transaction.atomic():
            response = self.client.post(reverse('CreatePageView'), data)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, '/cms/pages/create/?title=dublicate&slug=dublicate&thumbnail_url=')  # noqa

    def test_throw_exception(self):
        self.client.login(username='admin', password='adminpassword1234##')
        data = {
            'title': 'dublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicate',  # noqa
            'slug': 'slug',
            'thumbnail': ''
        }
        with transaction.atomic():
            response = self.client.post(reverse('CreatePageView'), data)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, '/cms/pages/create/?title=dublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicatedublicate&slug=slug&thumbnail_url=')  # noqa


class TestPagesView(TestCase):
    @classmethod
    def setUpTestData(self):
        # create 7 pages to test pagination
        for page_id in range(7):
            Page.objects.create(
                title=f"title{page_id}",
                slug=f"slug{page_id}",
            )
        # create super user to be able to login and have all permissions
        password = 'adminpassword1234##'
        User.objects.create_superuser(
            username='admin',
            email='admin@admin.com',
            password=password,
        )

    def tearDown(self):
        for page in Page.objects.all():
            page.delete()
        User.objects.get(username='admin').delete()

    def test_not_logged_in_redirect_passes(self):
        response = self.client.get('/cms/pages/')
        self.assertRedirects(response, '/cms/login/?next=/cms/pages/')

    def test_url_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get('/cms/pages/')

        self.assertEqual(str(response.context['user']), 'admin')
        self.assertEqual(response.status_code, 200)

    def test_url_from_name_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get(reverse('PagesView'))
        self.assertEqual(response.status_code, 200)

    def test_template_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get(reverse('PagesView'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'Cms/Pages/Pages.html')

    def test_pagination_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get(reverse('PagesView'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['pages']), 5)


class TestEditPageView(TestCase):
    @classmethod
    def setUpTestData(self):
        # create super user to be able to login and have all permissions
        password = 'adminpassword1234##'
        User.objects.create_superuser(
            username='admin',
            email='admin@admin.com',
            password=password,
        )
        User.objects.create_user(
            username='test',
            email='test@test.com',
            password='test',
        )
        Page.objects.create(
            title="title",
            slug="slug",
        )

    def tearDown(self):
        User.objects.get(username='admin').delete()
        User.objects.get(username='test').delete()
        for page in Page.objects.all():
            page.delete()

    def test_not_logged_in_redirect_passes(self):
        response = self.client.get('/cms/pages/slug/')
        self.assertRedirects(response, '/cms/login/?next=/cms/pages/slug/')

    def test_url_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get('/cms/pages/slug/')

        self.assertEqual(str(response.context['user']), 'admin')
        self.assertEqual(response.status_code, 200)

    def test_url_from_name_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get(reverse('EditPageView', args={'slug': 'slug'}))  # noqa
        self.assertEqual(response.status_code, 200)

    def test_template_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get(reverse('EditPageView', args={'slug': 'slug'}))  # noqa
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'Cms/Pages/EditPage.html')

    def test_page_not_exist(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.get('/cms/pages/not/')  # noqa
        self.assertEqual(response.status_code, 500)
        self.assertTemplateUsed(response, 'Cms/Modules/MessagesList.html')

    def test_post_no_permission(self):
        self.client.login(username='test', password='test')
        response = self.client.put(reverse('EditPageView', args={'slug': 'slug'}))  # noqa
        self.assertEqual(response.status_code, 403)
        self.assertTemplateUsed(response, 'Cms/Modules/MessagesList.html')

    def test_edit_page(self):
        self.client.login(username='admin', password='adminpassword1234##')
        with transaction.atomic():
            response = self.client.put(reverse('EditPageView', args={'slug': 'slug'}), data = 'title=title2&slug=slug2&thumbnail=hey&online=on', content_type = 'application/x-www-form-urlencoded')  # noqa
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'Cms/Modules/EditPageForm.html')

    def test_exception(self):
        self.client.login(username='admin', password='adminpassword1234##')
        data = {
            'title': 'title',
            'slug': 'title',
            'thumbnail': 'title'
        }
        with transaction.atomic():
            response = self.client.put(reverse('EditPageView', args={'slug': 'slug'}), data = data, content_type = 'application/x-www-form-urlencoded')  # noqa
        self.assertEqual(response.status_code, 500)
        self.assertTemplateUsed(response, 'Cms/Modules/MessagesList.html')


class TestDeletePageView(TestCase):
    @classmethod
    def setUpTestData(self):
        # create 7 pages to test pagination
        for page_id in range(7):
            Page.objects.create(
                title=f"title{page_id}",
                slug=f"slug{page_id}",
            )
        # create super user to be able to login and have all permissions
        password = 'adminpassword1234##'
        User.objects.create_superuser(
            username='admin',
            email='admin@admin.com',
            password=password,
        )
        User.objects.create_user(
            username='test',
            email='test@test.com',
            password='test',
        )

    def tearDown(self):
        for page in Page.objects.all():
            page.delete()
        User.objects.get(username='admin').delete()
        User.objects.get(username='test').delete()

    def test_url_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.delete('/cms/pages/slug1/delete/')
        self.assertEqual(str(response.context['user']), 'admin')
        self.assertEqual(response.status_code, 200)

    def test_url_from_name_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.delete(reverse('DeletePageView', args={ 'slug1'}))  # noqa
        self.assertEqual(response.status_code, 200)

    def test_template_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.delete('/cms/pages/slug1/delete/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'Cms/Modules/Empty.html')

    def test_post_no_permission(self):
        self.client.login(username='test', password='test')
        response = self.client.delete(reverse('DeletePageView', args={'slug': 'slug1'}))  # noqa
        self.assertEqual(response.status_code, 403)
        self.assertTemplateUsed(response, 'Cms/Modules/MessagesList.html')

    def test_exception(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.delete('/cms/pages/not/delete/')
        self.assertEqual(response.status_code, 500)
        self.assertTemplateUsed(response, 'Cms/Modules/MessagesList.html')


class TestCreateSectionView(TestCase):
    @classmethod
    def setUpTestData(self):
        # create super user to be able to login and have all permissions
        password = 'adminpassword1234##'
        User.objects.create_superuser(
            username='admin',
            email='admin@admin.com',
            password=password,
        )
        User.objects.create_user(
            username='test',
            email='test@test.com',
            password='test',
        )
        Page.objects.create(
            title="title",
            slug="slug",
        )

    def tearDown(self):
        User.objects.get(username='admin').delete()
        User.objects.get(username='test').delete()
        for page in Page.objects.all():
            page.delete()

    def test_url_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.post('/cms/pages/slug/sections/', {'new_name': 'section'})  # noqa
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('EditPageView', args={'slug'}))  # noqa

    def test_url_from_name_passes(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.post(reverse('CreateSectionView', args={'slug'}), {'new_name': 'section'})  # noqa
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('EditPageView', args={'slug'}))  # noqa

    def test_page_not_exist(self):
        self.client.login(username='admin', password='adminpassword1234##')
        response = self.client.post(reverse('CreateSectionView', args={'not'}))  # noqa
        self.assertEqual(response.status_code, 500)
        self.assertTemplateUsed(response, 'Cms/Modules/MessagesList.html')

    def test_post_no_permission(self):
        self.client.login(username='test', password='test')
        response = self.client.post(reverse('CreateSectionView', args={'slug'}))  # noqa
        self.assertEqual(response.status_code, 403)
        self.assertTemplateUsed(response, 'Cms/Modules/MessagesList.html')


class TestTemplateTags(TestCase):
    def render_template(self, string, context=None):
        context = context or {}
        context = Context(context)
        return Template(string).render(context)

    def test_get_item(self):
        rendered = self.render_template(
            '{{dict|get_item:"one"}}',
            context={'dict': {'one': '1'}}
        )
        self.assertEqual(rendered, "1")

    def test_get_value(self):
        rendered = self.render_template(
            '{{dict|get_value:"value"}}',
            context={'dict': [{'key': 'value', 'value': 'here'}]}
        )
        self.assertEqual(rendered, "here")

    def test_get_value_none(self):
        rendered = self.render_template(
            '{{dict|get_value:"no"}}',
            context={'dict': [{'key': 'value', 'value': 'here'}]}
        )
        self.assertEqual(rendered, "None")

    def test_get_value_by_key(self):
        rendered = self.render_template(
            '{{dict|get_value_by_key:"value"}}',
            context={'dict': [{'key': 'value', 'value': 'here'}]}
        )
        self.assertEqual(rendered, "here")

    def test_get_value_by_key_none(self):
        rendered = self.render_template(
            '{{dict|get_value_by_key:"no"}}',
            context={'dict': [{'key': 'value', 'value': 'here'}]}
        )
        self.assertEqual(rendered, "None")

    def test_add_as_string(self):
        rendered = self.render_template(
            '{{"Hello "|add_as_string:name}}',
            context={'name': 'name'}
        )
        self.assertEqual(rendered, "Hello name")

    def test_random_number(self):
        rendered = self.render_template(
            '{{"Hello "|random_number}}',
        )
        self.assertIn("Hello ", rendered)

    def test_create_array(self):
        rendered = self.render_template(
            '{{"1,2,3,4"|create_array:","}}',
        )
        self.assertEqual(rendered, "[&#x27;1&#x27;, &#x27;2&#x27;, &#x27;3&#x27;, &#x27;4&#x27;]")  # noqa
