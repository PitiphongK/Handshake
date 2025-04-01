from rest_framework import serializers
from AdminLists.models import Institution
from AdminLists.models import InterestActivity
from AdminLists.models import InterestField


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ["id", "name", "suffix"]


class InterestActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestActivity
        fields = ["id", "name"]

class InterestFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestField
        fields = ["id", "name"]