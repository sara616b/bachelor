from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User, Permission
from django.core.exceptions import ObjectDoesNotExist
import json
from django.contrib.contenttypes.models import ContentType


class UserApiTests(TestCase):
    def setUp(self):
        self.username = 'testuser'
        self.password = 'testpass'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password
        )

        self.permissions = [
            Permission.objects.create(
                codename='permission1',
                name='Permission 1',
                content_type=ContentType.objects.get(
                    app_label="auth", model="user"
                )
            ),
            Permission.objects.create(
                codename='permission2',
                name='Permission 2',
                content_type=ContentType.objects.get(
                    app_label="auth", model="user"
                )
            )
        ]
        self.user.user_permissions.set(self.permissions)

        self.client.post(reverse('LoginView'), {
            'username': self.username,
            'password': self.password,
        })

    def test_create_user(self):
        url = reverse('UserApi', args=['johndoe'])
        data = {
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'newpass',
            'is_superuser': 'true',
            'permissions': 'permission1,permission2'
        }

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            User.objects.filter(
                username=self.username
            ).exists()
        )
        user = User.objects.get(username='johndoe')
        self.assertEqual(user.first_name, 'John')
        self.assertEqual(user.last_name, 'Doe')
        self.assertEqual(user.email, 'john.doe@example.com')
        self.assertEqual(user.check_password('newpass'), True)
        self.assertEqual(user.is_superuser, True)
        self.assertEqual(
            list(
                user.user_permissions.values_list('codename', flat=True)
            ),
            ['permission1', 'permission2']
        )

    def test_get_user_not_found(self):
        url = reverse('UserApi', args=['nonexistentuser'])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 404)

    def test_create_user_duplicate_username(self):
        url = reverse('UserApi', args=[self.username])
        data = {
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'newpass',
            'is_superuser': 'true',
            'permissions': 'permission1,permission2'
        }
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, 400)
        self.assertFalse(User.objects.filter(first_name='John').exists())

    # for creating a valid body data for the put request in test_edit_user
    def _create_multipart_body(self, data, boundary):
        lines = []
        for key, value in data.items():
            lines.extend([
                f'--{boundary}',
                f'Content-Disposition: form-data; name="{key}"',
                '',
                str(value)
            ])
        lines.append(f'--{boundary}--')
        return '\r\n'.join(lines)

    def test_edit_user(self):
        url = reverse('UserApi', args=['johndoe'])
        data = {
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'newpass',
            'is_superuser': 'true',
            'permissions': 'permission1,permission2'
        }

        response = self.client.post(url, data=data)

        url = reverse('UserApi', args=['johndoe'])
        data = {
            'firstname': 'John',
            'lastname': 'Stag',
            'email': 'johndoe@example.com',
            'password': 'newpassword',
            'is_superuser': True,
            'permissions': ''
        }

        boundary = '----WebKitFormBoundary123456789'
        content_type = f'multipart/form-data; boundary={boundary}'
        body = self._create_multipart_body(data, boundary)

        response = self.client.put(
            url,
            data=body,
            content_type=content_type
        )

        self.assertEqual(response.status_code, 200)
        user = User.objects.get(username='johndoe')
        self.assertEqual(user.first_name, 'John')
        self.assertEqual(user.last_name, 'Stag')
        self.assertEqual(user.email, 'john.doe@example.com')
        self.assertEqual(user.is_superuser, True)
        self.assertEqual(
            list(
                user.user_permissions.values_list('codename', flat=True)
            ), []
        )

    def test_edit_user_not_found(self):
        url = reverse('UserApi', args=['nonexistentuser'])
        data = {
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@example.com',
            'is_superuser': 'true',
            'permissions': 'permission1,permission2'
        }
        response = self.client.put(url, data=data)

        self.assertEqual(response.status_code, 404)

    def test_delete_user(self):
        url = reverse('UserApi', args=[self.username])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, 200)
        self.assertRaises(
            ObjectDoesNotExist, User.objects.get, username=self.username
        )

    def test_delete_user_not_found(self):
        url = reverse('UserApi', args=['nonexistentuser'])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, 404)

    def test_get_all_users(self):
        url = reverse('GetAllUsersApi')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data['users']), 1)
        self.assertEqual(data['users'][0]['username'], self.username)
        self.assertEqual(data['users'][0]['is_superuser'], False)
        self.assertEqual(data['users'][0]['first_name'], '')
        self.assertEqual(data['users'][0]['last_name'], '')
        self.assertEqual(data['users'][0]['email'], self.user.email)
        self.assertEqual(data['users'][0]['username'], self.username)

    def test_get_permissions(self):
        url = reverse('GetPermissionsApi')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
