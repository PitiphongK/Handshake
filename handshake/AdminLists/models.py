from django.db import models

# from superuser.models import InstitutionProfile


class InterestField(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class InterestActivity(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Institution(models.Model):
    name = models.CharField(max_length=128, unique=True)
    suffix = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return self.name
