from django.test import Client, TestCase
from django.urls import reverse
from django.contrib.auth.models import User
import json


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'testuser'
        self.password = 'testpassword'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )

    def test_valid_login(self):
        response = self.client.post(reverse('LoginView'), {
            'username': self.username,
            'password': self.password,
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['result'], 'logged in')

    def test_invalid_login(self):
        response = self.client.post(reverse('LoginView'), {
            'username': self.username,
            'password': 'wrongpassword',
        })
        self.assertEqual(response.status_code, 204)
        self.assertEqual(
            json.loads(response.content)['result'], 'user not found'
        )


class LogoutViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'testuser'
        self.password = 'testpassword'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )
        self.client.force_login(self.user)

    def test_logout(self):
        response = self.client.get(reverse('LogoutView'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['result'], 'okay')


class AuthenticatedViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'testuser'
        self.password = 'testpassword'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
        )

    def test_unauthenticated(self):
        response = self.client.get(reverse('AuthenticatedView'))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(
            json.loads(response.content)['result'], 'unauthenticated'
        )

    def test_authenticated(self):
        self.client.force_login(self.user)
        response = self.client.get(reverse('AuthenticatedView'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            json.loads(response.content)['result'], 'authenticated'
        )
