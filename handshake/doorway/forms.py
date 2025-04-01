from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from doorway.models import UserProfile


class UserForm(UserCreationForm):
    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password1",
            "password2",
        ]


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        exclude = ["user", "institution", "is_official_account"]
