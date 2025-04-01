from sentence_transformers import SentenceTransformer
from doorway.models import UserProfile

MODEL_NAME = 'all-mpnet-base-v2'
model = SentenceTransformer(MODEL_NAME)


def generate_embedding_for_profile(profile):

    text_parts = []


    if profile.user and profile.user.username:
        text_parts.append(profile.user.username)

    if profile.bio:
        text_parts.append(profile.bio.lower())

    if profile.location:
        text_parts.append(profile.location.lower())

    if hasattr(profile, 'institutionProfile') and profile.institutionProfile:
        institution = getattr(profile.institutionProfile, 'institution', None)
        if institution and hasattr(institution, 'name'):
            text_parts.append(institution.name.lower())

    interest_fields = profile.interest_fields.all()
    if interest_fields.exists():
        fields_text = " ".join([field.name.lower() for field in interest_fields])
        text_parts.append(fields_text)

    interest_activities = profile.interest_activities.all()
    if interest_activities.exists():
        activities_text = " ".join([activity.name.lower() for activity in interest_activities])
        text_parts.append(activities_text)

    combined_text = " ".join(text_parts)

    embedding = model.encode(combined_text).tolist()

    profile.embedding = embedding
    profile.save(update_fields=['embedding'])
