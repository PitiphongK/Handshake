from django.test import TestCase
from rest_framework.test import APIClient
from AdminLists.models import Institution
from AdminLists.models import InterestActivity
from AdminLists.models import InterestField

# Create your tests here.


class InstitutionsTest(TestCase):
    def setUp(self):
        self.institution = Institution.objects.create(name="A", suffix="test.edu")
        self.institution2 = Institution.objects.create(name="B", suffix="test2.edu")
        self.client = APIClient()

    def test_institutions_endpoint_exists(self):
        res = self.client.get("/api/institutions/")
        self.assertEqual(res.status_code, 200)

    def test_institutions_endpoint_returns_institutions(self):
        res = self.client.get("/api/institutions/")
        self.assertContains(res, "A")
        self.assertContains(res, "B")

    def test_institutions_endpoint_by_id(self):
        res = self.client.get("/api/institutions/1/")
        self.assertContains(res, "A")
        self.assertNotContains(res, "B")

        res = self.client.get("/api/institutions/2/")
        self.assertContains(res, "B")
        self.assertNotContains(res, "A")


class InterestActivitiesTest(TestCase):
    def setUp(self):
        self.interest_activities = InterestActivity.objects.create(name="A")
        self.interest_activities2 = InterestActivity.objects.create(name="B")
        self.client = APIClient()

    def test_interest_activities_endpoint_exists(self):
        res = self.client.get("/api/interest-activities/")
        self.assertEqual(res.status_code, 200)

    def test_interest_activities_endpoint_returns_interest_activities(self):
        res = self.client.get("/api/interest-activities/")
        self.assertContains(res, "A")
        self.assertContains(res, "B")

    def test_interest_activities_endpoint_by_id(self):
        res = self.client.get("/api/interest-activities/1/")
        self.assertContains(res, "A")
        self.assertNotContains(res, "B")

        res = self.client.get("/api/interest-activities/2/")
        self.assertContains(res, "B")
        self.assertNotContains(res, "A")


class InterestFieldsTest(TestCase):
    def setUp(self):
        self.interest_fields = InterestField.objects.create(name="A")
        self.interest_fields2 = InterestField.objects.create(name="B")
        self.client = APIClient()

    def test_interest_fields_endpoint_exists(self):
        res = self.client.get("/api/interest-fields/")
        self.assertEqual(res.status_code, 200)

    def test_interest_fields_endpoint_returns_interest_fields(self):
        res = self.client.get("/api/interest-fields/")
        self.assertContains(res, "A")
        self.assertContains(res, "B")

    def test_interest_fields_endpoint_by_id(self):
        res = self.client.get("/api/interest-fields/1/")
        self.assertContains(res, "A")
        self.assertNotContains(res, "B")

        res = self.client.get("/api/interest-fields/2/")
        self.assertContains(res, "B")
        self.assertNotContains(res, "A")