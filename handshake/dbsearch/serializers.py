from rest_framework import serializers
from doorway.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    institutionProfile = serializers.StringRelatedField()
    interest_fields = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )
    interest_activities = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = UserProfile
        fields = [
            # i dont think id is needed
            # 'id',
            'user',
            'bio',
            'location',
            'institutionProfile',
            'interest_fields',
            'interest_activities',
            'embedding'
        ]
