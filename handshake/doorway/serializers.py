from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
import uuid
from .models import Institution, InterestActivity, InterestField, UserProfile


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ["url", "username", "email", "is_staff"]


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(
        source="user.email",
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Email already in use")
        ],
    )
    password = serializers.CharField(write_only=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    institution = serializers.PrimaryKeyRelatedField(
        required=False, queryset=Institution.objects.all()
    )
    interest_fields = serializers.PrimaryKeyRelatedField(
        many=True, required=False, queryset=InterestField.objects.all()
    )
    interest_activities = serializers.PrimaryKeyRelatedField(
        many=True, required=False, queryset=InterestActivity.objects.all()
    )
    picture = serializers.ImageField(required=False, allow_null=True)
    is_official_account = serializers.BooleanField(required=False, read_only=True)

    activation_token = serializers.UUIDField(read_only=True)
    email_verified = serializers.BooleanField(read_only=True)

    embedding = serializers.JSONField(read_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    class Meta:
        model = UserProfile
        fields = [
            "id",
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "bio",
            "location",
            "institution",
            "interest_fields",
            "interest_activities",
            "picture",
            "is_official_account",
            "activation_token",
            "email_verified",
            "activation_token",
            "embedding"
        ]
        depth = 1

    def create(self, validated_data):
        # Extract the password from the validated data
        password = validated_data.pop("password", None)

        user_data = validated_data.pop("user")

        user_data["username"] = user_data["email"].split("@")[0] + str(uuid.uuid4())

        user = User.objects.create_user(**user_data)

        if password:
            user.set_password(password)
            user.save()

        # extract email suffix for institution lookup
        user_email_suffix = user.email.split("@")[1]
        try:
            institution = Institution.objects.get(suffix=user_email_suffix)
        except Institution.DoesNotExist:
            user.delete()
            raise serializers.ValidationError(
                {"message": "Email does not belong to a member institution."}
            )

        interest_fields = validated_data.pop("interest_fields", None)
        interest_activities = validated_data.pop("interest_activities", None)

        # set institution and user on the profile
        user_profile = UserProfile.objects.create(
            user=user,
            institution=institution,
        )

        if interest_activities is not None:
            user_profile.interest_activities.set(interest_activities)
        if interest_fields is not None:
            user_profile.interest_fields.set(interest_fields)

        user_profile.bio = validated_data.get("bio")
        user_profile.location = validated_data.get("location")
        user_profile.picture = validated_data.get("picture")

        user_profile.first_name = validated_data.get("first_name")
        user_profile.last_name = validated_data.get("last_name")

        return user_profile


class EditUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "bio",
            "location",
            "picture",
            "interest_fields",
            "interest_activities",
        ]
