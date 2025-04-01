from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from doorway.models import UserProfile
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Project, ProjectPost


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    members = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(), many=True, required=False
    )
    owner = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(), required=False
    )
    posts = serializers.PrimaryKeyRelatedField(
        queryset=ProjectPost.objects.all(), many=True, required=False
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "owner",
            "date_created",
            "members",
            "posts",
        ]


class ProjectPostSerializer(serializers.HyperlinkedModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    author = serializers.PrimaryKeyRelatedField(
        queryset=UserProfile.objects.all(), required=False
    )

    class Meta:
        model = ProjectPost
        fields = [
            "id",
            "title",
            "content",
            "project",
            "author",
            "date_created",
        ]
