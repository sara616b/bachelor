# flake8: noqa
# from django.test import TestCase, RequestFactory
# from django.http import JsonResponse
# from unittest.mock import patch
# from django.urls import reverse
# from django.contrib.auth.models import User
# from page_manager.models import Page, Image
# from bson.json_util import dumps
# from page_manager.views import GetAllPagesApi


# class GetAllPagesApiTests(TestCase):
    
#     def setUp(self):
#         self.user = User.objects.create_user(username='testuser', password='testpassword')
#         self.client.login(username='testuser', password='testpassword')
#         self.factory = RequestFactory()

#     @patch('page_manager.views.mongo_client')  # Mocking the mongo_client
#     def test_get_all_pages_api(self, mock_mongo_client):
#         # Mock the data for Page.objects.all().values()
#         mock_page_data = [
#             {'page_title': 'Page 1', 'page_slug': 'page-1'},
#             {'page_title': 'Page 2', 'page_slug': 'page-2'},
#         ]
#         mock_queryset = mock_mongo_client.Bachelor['pages'].find_one.return_value = {
#             'data': {'sections': {}}  # Mocked data for the 'data' field
#         }
#         mock_mongo_client.Bachelor['pages'].find_one.side_effect = lambda query: next(
#             (page for page in mock_page_data if page['slug'] == query['page_slug']),
#             None
#         )

#         request = self.factory.get('/api/pages/')
#         response = GetAllPagesApi.as_view()(request)

#         # Assert the response
#         self.assertEqual(response.status_code, 200)
#         expected_data = {
#             'pages': [
#                 {'title': 'Page 1', 'slug': 'page-1', 'data': [{"field": "value"}]},
#                 {'title': 'Page 2', 'slug': 'page-2', 'data': [{"field": "value"}]},
#             ],
#         }
#         self.assertEqual(response.json(), expected_data)
#         mock_mongo_client.Bachelor['pages'].find_one.assert_called_once_with({'page_slug': 'page-1'})

#     # def setUp(self):
#     #     self.user = User.objects.create_user(username='testuser', password='testpassword')
#     #     self.client.login(username='testuser', password='testpassword')
#     #     self.page = Page.objects.create(title='Test Page', slug='test-page')
#     #     # self.database = mongo_client.Bachelor
#     #     # self.pages_collection = self.database['pages']

#     # @patch('page_manager.views.mongo_client')
#     # def test_get_all_pages_api(self):
#     #     page = Page(title='Test Page', slug='test-page')
#     #     mock_mongo_client.get_page.return_value = page
#     #     pages_objects = [
#     #         {
#     #             'page_title': 'Test Page',
#     #             'page_slug': 'test-page',
#     #             'data': {
#     #                 'sections': {}
#     #             },
#     #         }
#     #     ]

#     #     response = self.client.get(reverse('GetAllPagesApi'))
#     #     self.assertEqual(response.status_code, 200)
#     #     expected_data = json.loads(dumps(pages_objects))
#     #     self.assertEqual(response.json()['pages'], expected_data)


# class PageApiTests(TestCase):
#     def setUp(self):
#         self.user = User.objects.create_user(username='testuser', password='testpassword')
#         self.client.login(username='testuser', password='testpassword')
#         self.page = Page.objects.create(title='Test Page', slug='test-page')
#         self.database = mongo_client.Bachelor
#         self.pages_collection = self.database['pages']

#     def test_get_page_api(self):
#         response = self.client.get(reverse('PageApi', args=['test-page']))
#         self.assertEqual(response.status_code, 200)
#         page_data = self.pages_collection.find_one({'page_slug': 'test-page'})['data']
#         expected_data = {
#             'title': self.page.title,
#             'online': self.page.online,
#             'slug': self.page.slug,
#             'thumbnail_url': self.page.thumbnail_url,
#             'data': json.loads(dumps(page_data))
#         }
#         self.assertEqual(response.json()['data'], expected_data)

#     def test_post_page_api(self):
#         response = self.client.post(reverse('PageApi', args=['test-page']), {'title': 'New Page'})
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(Page.objects.filter(slug='test-page').exists(), True)
#         page_data = self.pages_collection.find_one({'page_slug': 'test-page'})
#         self.assertEqual(page_data['page_title'], 'New Page')

#     def test_delete_page_api(self):
#         response = self.client.delete(reverse('PageApi', args=['test-page']))
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(Page.objects.filter(slug='test-page').exists(), False)
#         page_data = self.pages_collection.find_one({'page_slug': 'test-page'})
#         self.assertEqual(page_data, None)

#     def test_put_page_api(self):
#         response = self.client.put(reverse('PageApi', args=['test-page']), {'title': 'Updated Page'})
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(Page.objects.get(slug='test-page').title, 'Updated Page')
#         page_data = self.pages_collection.find_one({'page_slug': 'test-page'})
#         self.assertEqual(page_data['page_title'], 'Updated Page')


# class GetPageApiTests(TestCase):
#     def test_get_page_api(self):
#         page = Page.objects.create(title='Test Page', slug='test-page', online=True)
#         response = self.client.get(reverse('GetPageApi', args=['test-page']))
#         self.assertEqual(response.status_code, 200)
#         expected_data = json.loads(dumps(page))
#         self.assertEqual(response.json()['data'], expected_data)


# class GetPagePreviewApiTests(TestCase):
#     def test_get_page_preview_api(self):
#         page = Page.objects.create(title='Test Page', slug='test-page')
#         response = self.client.get(reverse('GetPagePreviewApi', args=['test-page']))
#         self.assertEqual(response.status_code, 200)
#         expected_data = json.loads(dumps(page))
#         self.assertEqual(response.json()['data'], expected_data)


# class ImageApiTests(TestCase):
#     def setUp(self):
#         self.user = User.objects.create_user(username='testuser', password='testpassword')
#         self.client.login(username='testuser', password='testpassword')
#         self.page = Page.objects.create(title='Test Page', slug='test-page')
#         self.image = Image.objects.create(page=self.page, url='test.jpg')

#     def test_get_image_api(self):
#         response = self.client.get(reverse('UploadImageApi', args=[self.image.id]))
#         self.assertEqual(response.status_code, 200)
#         expected_data = {
#             'id': str(self.image.id),
#             'url': self.image.url,
#             'page': {
#                 'id': str(self.page.id),
#                 'title': self.page.title,
#                 'slug': self.page.slug,
#             }
#         }
#         self.assertEqual(response.json()['data'], expected_data)

#     def test_post_image_api(self):
#         response = self.client.post(reverse('UploadImageApi', args=[self.page.slug]), {'url': 'new_image.jpg'})
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(Image.objects.filter(url='new_image.jpg').exists(), True)

#     # def test_delete_image_api(self):
#     #     response = self.client.delete(reverse('UploadImageApi', args=[self.image.id]))
#     #     self.assertEqual(response.status_code, 200)
#     #     self.assertEqual(Image.objects.filter(id=self.image.id).exists(), False)

#     # def test_put_image_api(self):
#     #     response = self.client.put(reverse('UploadImageApi', args=[self.image.id]), {'url': 'updated_image.jpg'})
#     #     self.assertEqual(response.status_code, 200)
#     #     self.assertEqual(Image.objects.get(id=self.image.id).url, 'updated_image.jpg')
