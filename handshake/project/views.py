from django.shortcuts import render
from django.http import JsonResponse

from rest_framework import viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError

from doorway.models import UserProfile
from project.models import Project, ProjectPost
from project.serializers import ProjectSerializer, ProjectPostSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class CreateProjectView(CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        profile = UserProfile.objects.get(user=self.request.user)
        serializer.save(owner=profile)


class EditProjectView(APIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            project = Project.objects.get(id=request.data["id"])
        except:
            raise NotFound({"message": "Project not found"})

        profile = UserProfile.objects.get(user=self.request.user)
        if project.owner.id != profile.id:
            raise PermissionDenied(
                {"message": "Only the project owner can edit the project"}
            )

        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if not serializer.is_valid():
            raise ValidationError({**serializer.errors})

        serializer.save()

        return JsonResponse({"message": "Project updated successfully"})


class EditPostView(APIView):
    queryset = ProjectPost.objects.all()
    serializer_class = ProjectPostSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            post = ProjectPost.objects.get(id=request.data["id"])
        except:
            raise NotFound({"message": "Project not found"})

        profile = UserProfile.objects.get(user=self.request.user)
        if post.author.id != profile.id:
            raise PermissionDenied(
                {"message": "Only the post author can edit the post"}
            )

        serializer = ProjectPostSerializer(post, data=request.data, partial=True)
        if not serializer.is_valid():
            raise ValidationError({**serializer.errors})

        serializer.save()

        return JsonResponse({"message": "Post updated successfully"})


class ProjectPostViewSet(viewsets.ModelViewSet):
    queryset = ProjectPost.objects.all()
    serializer_class = ProjectPostSerializer


class CreatePostView(CreateAPIView):
    queryset = ProjectPost.objects.all()
    serializer_class = ProjectPostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]
        profile = UserProfile.objects.get(user=self.request.user)

        if profile not in project.members.all() and profile.id != project.owner.id:
            raise PermissionDenied(
                {
                    "message": "You must be a member or owner of this project to create posts"
                },
            )
        serializer.save(author=profile)


class DeletePostView(APIView):
    queryset = ProjectPost.objects.all()
    serializer_class = ProjectPostSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            post = ProjectPost.objects.get(id=request.data["id"])
        except:
            raise NotFound({"message": "Post not found"})

        profile = UserProfile.objects.get(user=self.request.user)
        if post.author.id != profile.id:
            raise PermissionDenied(
                {"message": "Only the post author can delete the post"}
            )

        post.delete()

        return JsonResponse({"message": "Post deleted successfully"})


class DeleteProjectView(APIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            project = Project.objects.get(id=request.data["id"])
        except:
            raise NotFound({"message": "Project not found"})

        profile = UserProfile.objects.get(user=self.request.user)
        if project.owner.id != profile.id:
            raise PermissionDenied(
                {"message": "Only the project owner can delete the project"}
            )

        project.delete()

        return JsonResponse({"message": "Post deleted successfully"})
