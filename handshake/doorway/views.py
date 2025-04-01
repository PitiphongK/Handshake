from django.contrib import messages
from django.shortcuts import render, redirect
from doorway.forms import UserForm, UserProfileForm
from AdminLists.models import Institution
from django.core.mail import send_mail
from django.conf import settings
from django.http import HttpRequest, JsonResponse, QueryDict
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout, login
from django.urls import reverse
from .models import UserProfile
from rest_framework import viewsets, status, serializers, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, UserProfileSerializer
from doorway.utils import generate_embedding_for_profile


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_profile = UserProfile.objects.filter(
            user=request.user
        ).first()  # get currently logged in user
        if not user_profile:
            return Response(
                {"message": "User profile not found."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # the fields that are allowed to be updated
        fields = {
            "bio",
            "location",
            "picture",
            "interest_fields",
            "interest_activities",
            "first_name",
            "last_name",
        }

        data = request.data.copy()
        for key in request.data:
            if key not in fields:
                del data[key]
        serializer = UserProfileSerializer(user_profile, data=data, partial=True)
        if not serializer.is_valid():
            return Response({**serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(
            {"message": "Profile updated successfully."}, status=status.HTTP_200_OK
        )


@api_view(["POST"])
def register_user(request):
    user_profile_serializer = UserProfileSerializer(data=request.data)

    if user_profile_serializer.is_valid():
        profile = user_profile_serializer.save()

        # Handle profile picture if present
        if "picture" in request.FILES:
            profile.picture = request.FILES["picture"]

        profile.save()

        # Send verification email
        send_verification_email(profile.user.id)
        return Response(
            {"message": "Registration successful. Verification email sent."},
            status=status.HTTP_201_CREATED,
        )

    # Return errors if validation fails
    errors = {**user_profile_serializer.errors}
    return Response({"message": errors}, status=status.HTTP_400_BAD_REQUEST)


def send_verification_email(user_id):
    user_profile = UserProfile.objects.get(user_id=user_id)

    user = user_profile.user
    token = user_profile.activation_token
    verify_url = settings.SITE_URL + "/verified/?token=" + str(token)
    # verify_url = "https:/" + "/verified/?token=" + str(token)

    send_mail(
        subject="Verify your account",
        message=f"Please click on the following link to verify your email address: {verify_url}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
    return Response(
        {"message": f"Verification email sent to {user.email}"},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def verify_email(request, token):
    try:
        user_profile = UserProfile.objects.get(activation_token=token)
        user_profile.email_verified = True
        user_profile.save()

        generate_embedding_for_profile(user_profile)
        login_token, _ = Token.objects.get_or_create(user=user_profile.user)
        login(request._request, user_profile.user)
        return Response(
            {
                "message": "Email verified successfully",
                "token": login_token.key,
                "user_id": user_profile.id,
            },
            status=status.HTTP_200_OK,
        )
    except UserProfile.DoesNotExist:
        return Response(
            {"message": "Invalid verification token."},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@api_view(["POST"])
def login_user(request):

    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"message": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    username = (
        User.objects.filter(email=email).values_list("username", flat=True).first()
    )
    if not username:
        return Response(
            {"message": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {"message": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # check if email has been verified or not
    try:
        user_profile = UserProfile.objects.get(user=user)
        if not user_profile.email_verified:
            return Response(
                {"message": "Please verify your email."},
                status=status.HTTP_403_FORBIDDEN,
            )
    except UserProfile.DoesNotExist:
        return Response(
            {"message": "User profile not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    token, _ = Token.objects.get_or_create(user=user)

    login(request._request, user)

    profile = UserProfile.objects.get(user=user)

    return Response(
        {
            "message": "Login successful.",
            "token": token.key,
            "user_id": profile.id,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def suffix_check(request):
    email = request.data.get("email")
    institution = request.data.get("institution")

    try:
        suffix = str.split(email, "@")[1]
    except:
        return Response(
            {"message": "Invalid email address"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    suf_institution = Institution.objects.filter(suffix=suffix).first()
    if not suf_institution:
        return Response(
            {"message": "Email address does not belong to any member institution"},
            status=status.HTTP_403_FORBIDDEN,
        )

    if institution:
        if institution != suf_institution.pk:
            return Response(
                {"message": "Email does not belong to the institution"},
                status=status.HTTP_403_FORBIDDEN,
            )
        return Response(
            {"message": "Email belongs to the member institution."},
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"message": "Email does not belong to the institution."},
            status=status.HTTP_403_FORBIDDEN,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_user(request):
    logout(request._request)
    return Response(
        {"message": "Logout successful."},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def auth_test(request):
    return Response({"message": "You are authenticated :)"}, status=status.HTTP_200_OK)
