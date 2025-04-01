import os
import django
import uuid
import requests
from django.core.files.base import ContentFile
from urllib.parse import urlparse
from dummy_profiles import dummy_profiles

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "handshake.settings")
django.setup()

from django.contrib.auth import get_user_model
from AdminLists.models import InterestField, InterestActivity, Institution
from doorway.models import UserProfile

User = get_user_model()

def save_profile_picture(user_profile, image_url):
    """Download and save an image to the user's profile image field."""
    try:
        response = requests.get(image_url, timeout=5)
        if response.status_code == 200:
            # Extract filename from URL
            parsed_url = urlparse(image_url)
            filename = os.path.basename(parsed_url.path)
            
            # Save image to media directory
            user_profile.picture.save(filename, ContentFile(response.content), save=True)
            print(f"Saved profile picture for {user_profile.user.username}")
        else:
            print(f"Failed to download image: {image_url}")
    except Exception as e:
        print(f"Error downloading image {image_url}: {e}")

def populate():
    """Populate institutions, interest fields, and activities."""
    interest_fields = ["Birds", "Trees", "Fish"]
    interest_activities = ["Mentoring", "Researching", "Reviewing"]
    institutions = [
        {"id": 1, "name": "University of Glasgow", "suffix": "glasgow.ac.uk"},
        {"id": 2, "name": "University of Glasgow (Student)", "suffix": "student.gla.ac.uk"},
        {"id": 3, "name": "Google", "suffix": "gmail.com"},
    ]

    # Create Interest Fields
    for field in interest_fields:
        InterestField.objects.get_or_create(name=field)

    # Create Interest Activities
    for activity in interest_activities:
        InterestActivity.objects.get_or_create(name=activity)

    # Create Institutions
    for inst in institutions:
        Institution.objects.get_or_create(id=inst["id"], name=inst["name"], suffix=inst["suffix"])

def populate_users():
    """Populate dummy user profiles in auth_user and doorway_userprofile."""
    for profile in dummy_profiles:
        # Create user in auth_user
        user, created = User.objects.get_or_create(username=profile["email"], email=profile["email"])
        if created:
            user.set_password("123")
            user.is_active = True
            user.first_name = profile["first_name"]
            user.last_name = profile["last_name"]
            user.save()

        # Ensure institution exists
        try:
            institution = Institution.objects.get(id=profile["institution"])
        except Institution.DoesNotExist:
            print(f"Error: Institution ID '{profile['institution']}' not found! Skipping user {profile['email']}.")
            continue  # Skip this user if institution is missing

        # Create or update user profile
        user_profile, created = UserProfile.objects.get_or_create(user=user, defaults={"institution": institution})
        
        # Update user profile attributes
        user_profile.first_name = profile["first_name"]
        user_profile.last_name = profile["last_name"]
        user_profile.bio = profile["bio"]
        user_profile.location = profile["location"]
        save_profile_picture(user_profile, profile["picture"])
        user_profile.email_verified = True  # Set verified
        user_profile.is_official_account = True  # Set as official account
        user_profile.activation_token = uuid.uuid4()  # Generate activation token

        # Assign interest fields by ID
        interest_fields = InterestField.objects.filter(id__in=profile["interest_fields"])
        user_profile.interest_fields.set(interest_fields)

        # Assign interest activities by ID
        interest_activities = InterestActivity.objects.filter(id__in=profile["interest_activities"])
        user_profile.interest_activities.set(interest_activities)

        # Save the updated profile
        user_profile.save()
    
    print("Finished populating users!")

if __name__ == "__main__":
    print("Starting population script")
    populate()  # Ensure necessary data is created first
    populate_users()
    print("Finished populating")
