from django.db import models

# from AdminLists.models import Institution


class InstitutionProfile(models.Model):
    institution = models.OneToOneField(
        "AdminLists.Institution", on_delete=models.CASCADE, related_name="profile"
    )
    description = models.CharField(max_length=999, null=True, blank=True)
    location = models.CharField(max_length=128, null=True, blank=True)
    picture = models.ImageField(upload_to="profile_images", null=True, blank=True)

    registration_link = models.URLField(unique=True)

    def __str__(self):
        return self.institution.name
