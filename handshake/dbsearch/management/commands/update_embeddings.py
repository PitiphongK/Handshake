from django.core.management.base import BaseCommand
from sentence_transformers import SentenceTransformer
from doorway.models import UserProfile


class Command(BaseCommand):
    help = "update all UserProfile's embedding"

    def handle(self, *args, **options):
        model = SentenceTransformer('all-mpnet-base-v2')

        profiles = UserProfile.objects.all()
        total = profiles.count()
        self.stdout.write(f"find {total} user，updating")

        for idx, profile in enumerate(profiles, start=1):
            text_parts = [profile.user.username]
            if profile.bio:
                text_parts.append(profile.bio)
            if profile.location:
                text_parts.append(profile.location)
            if profile.institutionProfile and hasattr(profile.institutionProfile, 'institution'):
                text_parts.append(profile.institutionProfile.institution.name)

                interest_fields_names = " ".join([field.name for field in profile.interest_fields.all()])
                if interest_fields_names:
                    text_parts.append(interest_fields_names)

                interest_activities_names = " ".join([activity.name for activity in profile.interest_activities.all()])
                if interest_activities_names:
                    text_parts.append(interest_activities_names)


            combined_text = " ".join(text_parts)

            embedding = model.encode(combined_text).tolist()

            profile.embedding = embedding
            profile.save(update_fields=['embedding'])

            self.stdout.write(f"({idx}/{total}) updated {profile.user.username} embedding")

        self.stdout.write(self.style.SUCCESS("all user embeddings updated"))
