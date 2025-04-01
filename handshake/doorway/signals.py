# doorway/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from doorway.models import UserProfile
from doorway.utils import generate_embedding_for_profile

@receiver(post_save, sender=UserProfile)
def update_embedding_on_save(sender, instance, created, update_fields, **kwargs):

    if update_fields and 'embedding' in update_fields:
        return

    if instance.email_verified:
        generate_embedding_for_profile(instance)
