import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from doorway.models import UserProfile
from AdminLists.models import Institution, InterestField, InterestActivity
from doorway.utils import generate_embedding_for_profile


class Command(BaseCommand):
    help = "Populate the database with 50 predefined dummy users for testing search functionality."

    def handle(self, *args, **options):

        hogwarts_houses = [
            ("Gryffindor", "gryffindor.edu"),
            ("Hufflepuff", "hufflepuff.edu"),
            ("Ravenclaw", "ravenclaw.edu"),
            ("Slytherin", "slytherin.edu")
        ]
        institutions = []
        for name, suffix in hogwarts_houses:
            inst, _ = Institution.objects.get_or_create(name=name, suffix=suffix)
            institutions.append(inst)

        interest_field_names = ["Biology", "Chemistry", "Physics", "Herbology", "Magical Creatures"]
        interest_fields = []
        for name in interest_field_names:
            field, _ = InterestField.objects.get_or_create(name=name)
            interest_fields.append(field)

        interest_activity_names = ["Hiking", "Reading", "Cycling", "Quidditch", "Potion Brewing"]
        interest_activities = []
        for name in interest_activity_names:
            activity, _ = InterestActivity.objects.get_or_create(name=name)
            interest_activities.append(activity)

        dummy_names = [
            "alice", "bob", "carol", "dave", "eve", "frank", "grace", "heidi", "ivan", "judy",
            "karen", "leo", "mike", "nancy", "oliver", "peggy", "quentin", "rachel", "steve", "trudy",
            "ursula", "victor", "wendy", "xander", "yvonne", "zach", "amber", "brad", "cindy", "daniel",
            "elena", "felix", "gina", "harry", "irene", "jack", "kyle", "linda", "matt", "nina",
            "oscar", "paul", "quincy", "rosa", "sam", "tina", "uma", "vince", "wanda", "xenia"
        ]
        dummy_names = dummy_names[:50]

        for username in dummy_names:
            institution = random.choice(institutions)
            email = f"{username}@{institution.suffix}"
            password = "password123"
            user = User.objects.create_user(username=username, email=email, password=password)

            BIO_TEMPLATES = [
                ("{username} grew up in {location} as a proud member of {house}. "
                 "With a keen interest in {subject}, they spent countless hours mastering {activity} "
                 "and exploring the mysteries of the magical world. Their journey is both inspiring and unique."),
                ("Hailing from {location}, {username} of {house} has always been fascinated by {subject}. "
                 "They are known for their adventurous spirit in {activity} and for seeking knowledge beyond the ordinary."),
                (
                    "As a dedicated member of {house} from {location}, {username} has developed a deep passion for {subject}. "
                    "Whether it is through {activity} or deep study, their commitment to growth is evident in every step they take."),
                (
                    "{username} from {house} calls {location} home. A lover of {subject} and an avid practitioner of {activity}, "
                    "they combine curiosity with determination to unravel the secrets of both the magical and non-magical realms.")
            ]

            SUBJECTS = ["Biology", "Herbology", "Magical Creatures", "Potion Brewing", "Ancient Runes"]
            ACTIVITIES = ["Quidditch matches", "exploring the Forbidden Forest", "attending magical lectures",
                          "researching ancient spells", "practicing potion brewing"]
            LOCATIONS = ["Hogsmeade", "Diagon Alley", "The Great Hall", "Mystic Library"]

            bio_template = random.choice(BIO_TEMPLATES)
            bio = bio_template.format(
                username=username,
                house=institution.name,
                subject=random.choice(SUBJECTS),
                activity=random.choice(ACTIVITIES),
                location=random.choice(LOCATIONS)
            )

            profile = UserProfile.objects.create(
                user=user,
                bio=bio,
                location="Hogsmeade",
                institution=institution,
                email_verified=True,  # 标记为已验证
            )

            num_fields = random.randint(1, len(interest_fields))
            num_activities = random.randint(1, len(interest_activities))
            fields_sample = random.sample(interest_fields, k=num_fields)
            activities_sample = random.sample(interest_activities, k=num_activities)
            profile.interest_fields.set(fields_sample)
            profile.interest_activities.set(activities_sample)
            profile.save()

            # generate_embedding_for_profile(profile)

            self.stdout.write(self.style.SUCCESS(f"Created dummy user: {username} ({institution.name})"))

        self.stdout.write(self.style.SUCCESS(
            "Successfully populated 50 predefined dummy users with Hogwarts institutions and longer bios."))
