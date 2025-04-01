from django.shortcuts import render
from rest_framework import viewsets
from AdminLists.models import Institution
from AdminLists.serializers import InstitutionSerializer
from AdminLists.models import InterestActivity
from AdminLists.serializers import InterestActivitySerializer
from AdminLists.models import InterestField
from AdminLists.serializers import InterestFieldSerializer

class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer

class InterestActivityViewSet(viewsets.ModelViewSet):
    queryset = InterestActivity.objects.all()
    serializer_class = InterestActivitySerializer

class InterestFieldViewSet(viewsets.ModelViewSet):
    queryset = InterestField.objects.all()
    serializer_class = InterestFieldSerializer