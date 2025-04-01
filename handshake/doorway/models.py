from django.conf import settings
from django.db import models
from pgvector.django import VectorField
from AdminLists.models import InterestField, InterestActivity, Institution
from pgvector.django import VectorField, HnswIndex
from django.db.models import Index

import uuid

class TrigramIndex(Index):
    def create_sql(self, model, schema_editor, using=''):
        fields = [model._meta.get_field(field_name) for field_name in self.fields]
        return schema_editor._create_trigram_index_sql(model, fields, self.name)


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.CharField(max_length=999, null=True, blank=True)
    location = models.CharField(max_length=128, null=True, blank=True)
    institution = models.ForeignKey(
        Institution,
        on_delete=models.CASCADE,
        related_name="members",
        null=False,
        blank=False,
    )
    interest_fields = models.ManyToManyField(
        InterestField, blank=True, related_name="interested_users"
    )
    interest_activities = models.ManyToManyField(
        InterestActivity, blank=True, related_name="active_users"
    )
    picture = models.ImageField(upload_to="profile_images", null=True, blank=True)
    first_name = models.CharField(max_length=128, default="")
    last_name = models.CharField(max_length=128, default="")

    is_official_account = models.BooleanField(default=False)
    activation_token = models.UUIDField(default=uuid.uuid4, editable=False)
    email_verified = models.BooleanField(default=False)

    embedding = VectorField(dimensions=768, null=True, blank=True)


    def __str__(self):
        return self.user.username
