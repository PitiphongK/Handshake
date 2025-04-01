from django.conf import settings
from django.db import models
from doorway.models import UserProfile
from AdminLists.models import InterestField, InterestActivity


class Project(models.Model):
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=999, null=True, blank=True)
    fields = models.ManyToManyField(InterestField, blank=True, related_name="projects")
    activities = models.ManyToManyField(
        InterestActivity, blank=True, related_name="projects_activity"
    )
    date_created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    members = models.ManyToManyField(
        UserProfile, blank=True, related_name="project_members"
    )

    def __str__(self):
        return self.name


class ProjectPost(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="posts")
    # file = models.FileField()  # file uploaded for reviewing, will have to decide upload location first
    author = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="project_posts"
    )
    date_created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.author.username} in {self.project.name}"
