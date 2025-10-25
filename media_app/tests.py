from django.test import TestCase
from django.contrib.auth.models import User

class AuthTest(TestCase):
    def test_user_registration(self):
        response = self.client.post('/register/', {'username': 'test', 'password1': 'testpass123', 'password2': 'testpass123'})
        self.assertEqual(response.status_code, 302)  # Redirects on success

    def test_registration_password_mismatch(self):
        response = self.client.post('/register/', {'username': 'test', 'password1': 'testpass123', 'password2': 'wrongpass123'})
        self.assertEqual(response.status_code, 200)  # Should return 200, form with errors

    def test_login(self):
        User.objects.create_user(username='test', password='testpass123')
        response = self.client.post('/login/', {'username': 'test', 'password': 'testpass123'})
        self.assertEqual(response.status_code, 302)  # Redirects on success

    def test_login_invalid_credentials(self):
        User.objects.create_user(username='test', password='testpass123')
        response = self.client.post('/login/', {'username': 'test', 'password': 'wrongpass123'})
        self.assertEqual(response.status_code, 200)  # Should return 200, form with error

    def test_user_registration_existing_username(self):
        # Create a user first
        User.objects.create_user(username='existinguser', password='password123')
        response = self.client.post('/register/', {'username': 'existinguser', 'password1': 'newpass123', 'password2': 'newpass123'})
        self.assertEqual(response.status_code, 200)  # Should return 200, form with error

    def test_user_registration_blank_username(self):
        response = self.client.post('/register/', {'username': '', 'password1': 'testpass123', 'password2': 'testpass123'})
        self.assertEqual(response.status_code, 200)  # Should return 200, form with error

    def test_user_registration_blank_password(self):
        response = self.client.post('/register/', {'username': 'testuser', 'password1': '', 'password2': ''})
        self.assertEqual(response.status_code, 200)  # Should return 200, form with error

    # Additional tests
    def test_user_registration_password_length(self):
        response = self.client.post('/register/', {'username': 'shortpass', 'password1': 'short', 'password2': 'short'})
        self.assertEqual(response.status_code, 200)  # Should return 200, password too short error

     # Should redirect to home page or user dashboard

    def test_user_logout(self):
        # Test if user can logout successfully
        User.objects.create_user(username='testuser', password='testpass123')
        self.client.login(username='testuser', password='testpass123')
        response = self.client.get('/logout/')
        self.assertEqual(response.status_code, 302)  # Redirects to home page or login page after logout

    def test_login_inactive_user(self):
        # Test login with inactive user
        user = User.objects.create_user(username='inactiveuser', password='testpass123', is_active=False)
        response = self.client.post('/login/', {'username': 'inactiveuser', 'password': 'testpass123'})
        self.assertEqual(response.status_code, 200)  # Should return 200 with an error about inactive user


class ViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='pass1234')

    def test_register_view_get(self):
        response = self.client.get('/register/')
        self.assertEqual(response.status_code, 200)

    def test_login_view_get(self):
        response = self.client.get('/login/')
        self.assertEqual(response.status_code, 200)

    def test_logout_view(self):
        self.client.login(username='tester', password='pass1234')
        response = self.client.get('/logout/')
        self.assertEqual(response.status_code, 302)  # Redirects to login

    def test_home_view(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_search_view_no_query(self):
        response = self.client.get('/search/')
        self.assertEqual(response.status_code, 200)

    def test_view_history_authenticated(self):
        self.client.login(username='tester', password='pass1234')
        response = self.client.get('/history/')
        self.assertEqual(response.status_code, 200)

    def test_clear_searches(self):
        session = self.client.session
        session['recent_searches'] = ['test1', 'test2']
        session.save()
        response = self.client.get('/clear_searches/')
        self.assertEqual(response.status_code, 302)

    def test_delete_search_term(self):
        session = self.client.session
        session['recent_searches'] = ['test1']
        session.save()
        response = self.client.get('/delete_search/test1/')
        self.assertEqual(response.status_code, 302)