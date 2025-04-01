from django.test import TestCase
from django.contrib.auth.models import User
from doorway.models import UserProfile
from rest_framework.test import APIClient
from .models import Project, ProjectPost
from AdminLists.models import Institution


class ProjectTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            username="testuser", email="testuser@test", password="top_secret"
        )
        self.user1 = User.objects.create_user(
            username="testuser1", email="testuser1@test", password="top_secret"
        )
        self.user2 = User.objects.create_user(
            username="testuser2", email="testuser2@test", password="top_secret"
        )
        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )

        self.owner_profile = UserProfile.objects.create(
            user=self.owner,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )
        self.user1_profile = UserProfile.objects.create(
            user=self.user1,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )
        self.user2_profile = UserProfile.objects.create(
            user=self.user2,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )

        self.project1 = Project.objects.create(
            name="Project 1",
            description="Project 1 description",
            owner=self.owner_profile,
        )

        self.project2 = Project.objects.create(
            name="Project 2",
            description="Project 2 description",
            owner=self.owner_profile,
        )
        self.project2.members.set([self.user1_profile.id, self.user2_profile.id])

        self.post = ProjectPost.objects.create(
            title="Post 1",
            content="Post 1 content",
            project=self.project1,
            author=self.owner_profile,
        )

    def test_projects_endpoint_exists(self):
        response = self.client.get("/api/projects/")
        self.assertEqual(response.status_code, 200)

    def test_projects_endpoint_returns_all_projects(self):
        response = self.client.get("/api/projects/")
        self.assertEqual(len(response.data), 2)

    def test_projects_endpoint_by_id(self):
        response = self.client.get("/api/projects/1/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.project1.name)
        self.assertNotContains(response, self.project2.name)
        self.assertEqual(response.data.get("owner"), self.owner_profile.id)

        response = self.client.get("/api/projects/2/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.project2.name)
        self.assertNotContains(response, self.project1.name)
        self.assertEqual(response.data.get("owner"), self.owner_profile.id)
        self.assertEqual(len(response.data.get("members")), 2)

        self.assertEqual(
            list(response.data.get("members")),
            [self.user1_profile.id, self.user2_profile.id],
        )

    def test_projects_posts_endpoint_by_id(self):
        response = self.client.get("/api/projects/1/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("posts")[0], self.post.id)

        response = self.client.get("/api/projects/2/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data.get("posts")), 0)


class ProjectPostTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )

        self.owner = User.objects.create_user(
            username="testuser", email="testuser@test", password="top_secret"
        )
        self.owner_profile = UserProfile.objects.create(
            user=self.owner,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )
        self.project = Project.objects.create(
            name="Project 1",
            description="Project 1 description",
            owner=self.owner_profile,
        )

        self.post = ProjectPost.objects.create(
            title="Post 1",
            content="Post 1 content",
            project=self.project,
            author=self.owner_profile,
        )

    def test_project_post_endpoint_exists(self):
        response = self.client.get("/api/posts/")
        self.assertEqual(response.status_code, 200)

    def test_project_post_endpoint_by_id(self):
        response = self.client.get("/api/posts/1/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.post.title)
        self.assertContains(response, self.post.content)
        self.assertEqual(response.data.get("project"), self.project.id)
        self.assertEqual(response.data.get("author"), self.owner_profile.id)


class CreateProjectTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )

        self.owner = User.objects.create_user(
            username="testuser", email="testuser@test", password="top_secret"
        )
        self.user1 = User.objects.create_user(
            username="testuser1", email="testuser1@test", password="top_secret"
        )

        self.owner_profile = UserProfile.objects.create(
            user=self.owner,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )
        self.user1_profile = UserProfile.objects.create(
            user=self.user1,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )

        self.client.force_login(self.owner)

    def test_create_project(self):
        response = self.client.post(
            "/api/create-project/",
            {"name": "Test Project", "description": "Test Description"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)

        project = Project.objects.get(name="Test Project")
        self.assertEqual(project.owner, self.owner_profile)
        self.assertEqual(project.description, "Test Description")
        self.assertEqual(project.name, "Test Project")

    def test_create_project_with_members(self):
        response = self.client.post(
            "/api/create-project/",
            {
                "name": "Test Project",
                "description": "Test Description",
                "members": [self.owner_profile.id, self.user1_profile.id],
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)

        project = Project.objects.get(name="Test Project")
        self.assertEqual(project.owner, self.owner_profile)
        self.assertEqual(project.description, "Test Description")
        self.assertEqual(project.name, "Test Project")
        self.assertEqual(
            list(project.members.all()), [self.owner_profile, self.user1_profile]
        )


class EditProjectTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )

        self.owner = User.objects.create_user(
            username="testuser", email="testuser@test", password="top_secret"
        )
        self.not_owner = User.objects.create_user(
            username="testuser1", email="testuser1@test", password="top_secret"
        )

        self.owner_profile = UserProfile.objects.create(
            user=self.owner,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )
        self.not_owner_profile = UserProfile.objects.create(
            user=self.not_owner,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )

        self.project = Project.objects.create(
            name="Project 1",
            description="Project 1 description",
            owner=self.owner_profile,
        )
        self.client.force_login(self.owner)

    def test_edit_project(self):
        response = self.client.post(
            "/api/edit-project/",
            {
                "id": self.project.id,
                "name": "Test Project",
                "description": "Test Description",
                "members": [self.owner_profile.id, self.not_owner_profile.id],
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)

        project = Project.objects.get(id=self.project.id)
        self.assertEqual(project.owner, self.owner_profile)
        self.assertEqual(project.description, "Test Description")
        self.assertEqual(project.name, "Test Project")
        self.assertEqual(
            list(project.members.all()), [self.owner_profile, self.not_owner_profile]
        )

    def test_edit_project_not_owner(self):
        self.client.force_login(self.not_owner)
        response = self.client.post(
            "/api/edit-project/",
            {
                "id": self.project.id,
                "name": "Test Project",
                "description": "Test Description",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_edit_project_invalid_id(self):
        response = self.client.post(
            "/api/edit-project/",
            {
                "id": 9999,
                "name": "Test Project",
                "description": "Test Description",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 404)


class CreatePostTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )
        self.owner = User.objects.create_user(
            username="testuser", email="testuser@test", password="top_secret"
        )
        self.non_member = User.objects.create_user(
            username="testuser1", email="testuser1@test", password="top_secret"
        )

        self.owner_profile = UserProfile.objects.create(
            user=self.owner,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )
        self.non_member_profile = UserProfile.objects.create(
            user=self.non_member,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )

        self.client.force_login(self.owner)

        self.project = Project.objects.create(
            name="Project 1",
            description="Project 1 description",
            owner=self.owner_profile,
        )
        self.project.members.set([self.owner_profile.id])

    def test_create_post(self):
        self.client.force_login(self.owner)
        response = self.client.post(
            "/api/create-post/",
            {
                "title": "Test Post",
                "content": "Test Content",
                "project": self.project.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data.get("title"), "Test Post")
        self.assertEqual(response.data.get("content"), "Test Content")
        self.assertEqual(response.data.get("project"), self.project.id)
        self.assertEqual(response.data.get("author"), self.owner_profile.id)

        self.assertEqual(Project.objects.get(id=self.project.id).posts.count(), 1)

    def test_create_post_non_member(self):
        self.client.force_login(self.non_member)
        response = self.client.post(
            "/api/create-post/",
            {
                "title": "Test Post",
                "content": "Test Content",
                "project": self.project.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 403)

    def test_create_post_invalid_project(self):
        self.client.force_login(self.owner)
        response = self.client.post(
            "/api/create-post/",
            {
                "title": "Test Post",
                "content": "Test Content",
                "project": 9999,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)


class DeletePostTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.institution = Institution.objects.create(
            name="Test University", suffix="test.edu"
        )
        self.owner = User.objects.create_user(
            username="testuser", email="testuser@test", password="top_secret"
        )
        self.not_owner = User.objects.create_user(
            username="testuser1", email="testuser1@test", password="top_secret"
        )

        self.owner_profile = UserProfile.objects.create(
            user=self.owner,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )
        self.not_owner_profile = UserProfile.objects.create(
            user=self.not_owner,
            first_name="John",
            last_name="Doe",
            institution=self.institution,
        )

        self.project = Project.objects.create(
            name="Project 1",
            description="Project 1 description",
            owner=self.owner_profile,
        )
        self.post = ProjectPost.objects.create(
            title="Test Post",
            content="Test Content",
            author=self.owner_profile,
            project=self.project,
        )

    def test_delete_post(self):
        self.client.force_login(self.owner)
        response = self.client.post(
            "/api/delete-post/",
            {"id": self.post.id},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(ProjectPost.objects.count(), 0)

    def test_delete_post_not_owner(self):
        self.client.force_login(self.not_owner)
        response = self.client.post(
            "/api/delete-post/",
            {"id": self.post.id},
            format="json",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(ProjectPost.objects.count(), 1)

    def test_delete_post_invalid_id(self):
        self.client.force_login(self.owner)
        response = self.client.post(
            "/api/delete-post/",
            {"id": 9999},
            format="json",
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(ProjectPost.objects.count(), 1)
