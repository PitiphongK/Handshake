import uuid
from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import logout, login
from doorway.models import UserProfile
from AdminLists.models import Institution, InterestField, InterestActivity
from django.core import mail
from doorway.views import send_verification_email


class RegistrationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.institution = Institution.objects.create(
            name="Test Uni", suffix="test.edu"
        )
        self.email = "newuser123@test.edu"
        self.bad_email = "newuser123@wrong.edu"
        self.first_name = "firstname"
        self.last_name = "lastname"

    def test_register_user_success(self):
        response = self.client.post(
            reverse("doorway:register-user"),
            {
                "password": "Comp!exPassword123",
                "email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(email=self.email).exists())
        self.assertTrue(UserProfile.objects.filter(user__email=self.email).exists())

        user_profile = UserProfile.objects.filter(user__email=self.email).first()
        self.assertEqual(user_profile.first_name, self.first_name)
        self.assertEqual(user_profile.last_name, self.last_name)

    def test_register_user_fail_suffix_mismatch(self):
        response = self.client.post(
            reverse("doorway:register-user"),
            {
                "password": "Comp!exPassword123",
                "email": self.bad_email,
                "first_name": self.first_name,
                "last_name": self.last_name,
            },
            format="json",
        )
        self.assertIn(
            "Email does not belong to a member institution", response.content.decode()
        )
        self.assertFalse(User.objects.filter(email=self.bad_email).exists())
        self.assertNotEqual(response.status_code, 200)

    def test_register_user_fail_no_name(self):
        response = self.client.post(
            reverse("doorway:register-user"),
            {
                "password": "Comp!exPassword123",
                "email": self.email,
            },
            format="json",
        )
        self.assertIn("This field is required", response.content.decode())
        self.assertFalse(User.objects.filter(email=self.email).exists())
        self.assertNotEqual(response.status_code, 200)

        response = self.client.post(
            reverse("doorway:register-user"),
            {
                "password": "Comp!exPassword123",
                "email": self.email,
                "first_name": self.first_name,
            },
            format="json",
        )
        self.assertIn("This field is required", response.content.decode())
        self.assertFalse(User.objects.filter(email=self.email).exists())
        self.assertNotEqual(response.status_code, 200)

        response = self.client.post(
            reverse("doorway:register-user"),
            {
                "password": "Comp!exPassword123",
                "email": self.email,
                "last_name": self.last_name,
            },
            format="json",
        )
        self.assertIn("This field is required", response.content.decode())
        self.assertFalse(User.objects.filter(email=self.email).exists())
        self.assertNotEqual(response.status_code, 200)


class SendVerificationEmailTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )

        self.user = User.objects.create_user(
            username="testuser", email="testuser@test.edu", password="top_secret"
        )

        self.profile = UserProfile.objects.create(
            user=self.user, institution=self.institution, activation_token=uuid.uuid4()
        )

    def test_send_verification_email(self):
        response = send_verification_email(self.user.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Verify your account", mail.outbox[0].subject)
        self.assertIn(
            "Please click on the following link to verify your email address:",
            mail.outbox[0].body,
        )
        self.assertIn(str(self.profile.activation_token), mail.outbox[0].body)


class EmailVerificationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )

        self.user = User.objects.create_user(
            username="testuser", email="testuser@test.edu", password="top_secret"
        )

        self.profile = UserProfile.objects.create(
            user=self.user, institution=self.institution, activation_token=uuid.uuid4()
        )

    def test_verify_email(self):
        token = self.profile.activation_token
        response = self.client.get(reverse("doorway:verify-email", args=[str(token)]))
        self.profile.refresh_from_db()
        self.assertTrue(self.profile.email_verified)
        self.assertEqual(response.status_code, 200)


class LoginTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )

        self.user = User.objects.create_user(
            username="testuser", email="testuser@test.edu", password="top_secret"
        )

        self.profile = UserProfile.objects.create(
            user=self.user, institution=self.institution, activation_token=uuid.uuid4()
        )

        self.profile.email_verified = True
        self.profile.save()

    def test_correct_login(self):
        response = self.client.post(
            reverse("doorway:login"),
            {"email": self.user.email, "password": "top_secret"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Login successful.")

    def test_incorrect_login(self):
        response = self.client.post(
            reverse("doorway:login"),
            {"email": "incorrect@test.edu", "password": "wrong_password"},
            format="json",
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Invalid email or password.")

    def test_correct_login_email_not_verified(self):
        self.profile.email_verified = False
        self.profile.save()
        response = self.client.post(
            reverse("doorway:login"),
            {"email": self.user.email, "password": "top_secret"},
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_incorrect_login_email_not_verified(self):
        self.profile.email_verified = False
        self.profile.save()
        response = self.client.post(
            reverse("doorway:login"),
            {"email": self.user.email, "password": "wrong_password"},
            format="json",
        )
        self.assertEqual(response.status_code, 401)


class AuthViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )

        self.user = User.objects.create_user(
            username="testuser", email="testuser@test.edu", password="top_secret"
        )

        self.profile = UserProfile.objects.create(
            user=self.user, institution=self.institution, activation_token=uuid.uuid4()
        )

        self.profile.email_verified = True
        self.profile.save()

    def test_not_authenticated(self):
        self.client.logout()
        response = self.client.get(reverse("doorway:auth-test"))
        self.assertEqual(response.status_code, 401)

    def test_authenticated(self):
        self.client.login(username="testuser", password="top_secret")
        response = self.client.get(reverse("doorway:auth-test"))
        self.assertEqual(response.status_code, 200)


class EmailSuffixTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )
        self.institution2 = Institution.objects.create(
            name="Other University", suffix="other.edu"
        )

    def test_valid_email_suffix(self):
        response = self.client.post(
            reverse("doorway:suffix-check"),
            {"email": "testuser@test.edu", "institution": self.institution.pk},
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_valid_suffix_wrong_institution(self):
        response = self.client.post(
            reverse("doorway:suffix-check"),
            {"email": "testuser@other.edu", "institution": self.institution.pk},
            format="json",
        )
        self.assertEqual(response.status_code, 403)
        self.assertIn("message", response.data)
        self.assertEqual(
            response.data["message"], "Email does not belong to the institution"
        )

    def test_invalid_suffix(self):
        response = self.client.post(
            reverse("doorway:suffix-check"),
            {"email": "testuser@invalid.edu", "institution": self.institution.pk},
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_invalid_email(self):
        response = self.client.post(
            reverse("doorway:suffix-check"),
            {"email": "Not a valid email", "institution": self.institution.pk},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Invalid email address")


class ProfileEditTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )

        InterestField.objects.create(name="Field 1")
        InterestField.objects.create(name="Field 2")
        InterestField.objects.create(name="Field 3")
        InterestActivity.objects.create(name="Activity 1")
        InterestActivity.objects.create(name="Activity 2")
        InterestActivity.objects.create(name="Activity 3")

        self.user = User.objects.create_user(
            username="testuser", email="testuser@test.edu", password="top_secret"
        )

        self.user_profile = UserProfile.objects.create(
            user=self.user,
            institution=self.institution,
            activation_token=uuid.uuid4(),
            first_name="John",
            last_name="Doe",
        )

        self.user_profile.email_verified = True
        self.user_profile.save()

        self.client.login(username="testuser", password="top_secret")

    def test_not_logged_in(self):
        self.client.logout()
        response = self.client.post(
            reverse("edit-profile"), {"bio": "i didn't log in"}, format="json"
        )
        self.assertEqual(response.status_code, 401)

    def test_bio_edit(self):
        new_bio = "i changed my bio to this"
        response = self.client.post(
            reverse("edit-profile"),
            {"bio": new_bio},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user_profile.refresh_from_db()
        self.assertEqual(self.user_profile.bio, new_bio)

    def test_location_edit(self):
        new_location = "Antarctica"
        response = self.client.post(
            reverse("edit-profile"),
            {"location": new_location},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user_profile.refresh_from_db()
        self.assertEqual(self.user_profile.location, new_location)

    def test_interests_edit(self):
        new_interests = [3, 1]
        response = self.client.post(
            reverse("edit-profile"),
            {
                "interest_fields": new_interests,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user_profile.refresh_from_db()
        self.assertEqual(self.user_profile.interest_fields.count(), len(new_interests))
        for interest in new_interests:
            self.assertTrue(
                self.user_profile.interest_fields.filter(id=interest).exists()
            )

    def test_interest_activities_edit(self):
        new_activities = [1, 2]
        response = self.client.post(
            reverse("edit-profile"),
            {
                "interest_activities": new_activities,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user_profile.refresh_from_db()

        self.assertEqual(
            self.user_profile.interest_activities.count(), len(new_activities)
        )
        for activity in new_activities:
            self.assertTrue(
                self.user_profile.interest_activities.filter(id=activity).exists()
            )

    def test_first_name_edit(self):
        new_first_name = "New"
        response = self.client.post(
            reverse("edit-profile"),
            {
                "first_name": new_first_name,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user_profile.refresh_from_db()
        self.assertEqual(self.user_profile.first_name, new_first_name)

    def test_last_name_edit(self):
        new_last_name = "Name"
        response = self.client.post(
            reverse("edit-profile"),
            {
                "last_name": new_last_name,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user_profile.refresh_from_db()
        self.assertEqual(self.user_profile.last_name, new_last_name)

    def test_multiple_fields_edit(self):
        new_bio = "i changed my bio to this"
        new_location = "Antarctica"
        new_interests = [1]
        new_interest_activities = [1, 2]
        new_first_name = "New"
        new_last_name = "Name"
        response = self.client.post(
            reverse("edit-profile"),
            {
                "bio": new_bio,
                "location": new_location,
                "interest_fields": new_interests,
                "interest_activities": new_interest_activities,
                "first_name": new_first_name,
                "last_name": new_last_name,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user_profile.refresh_from_db()
        self.assertEqual(self.user_profile.bio, new_bio)
        self.assertEqual(self.user_profile.location, new_location)
        self.assertEqual(self.user_profile.interest_fields.count(), len(new_interests))
        self.assertEqual(self.user_profile.first_name, new_first_name)
        self.assertEqual(self.user_profile.last_name, new_last_name)
        self.assertEqual(
            self.user_profile.interest_activities.count(), len(new_interest_activities)
        )

        for interest in new_interests:
            self.assertTrue(
                self.user_profile.interest_fields.filter(id=interest).exists()
            )

        for activity in new_interest_activities:
            self.assertTrue(
                self.user_profile.interest_activities.filter(id=activity).exists()
            )
