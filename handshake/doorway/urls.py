from django.urls import path
from django.conf.urls import include
from rest_framework.authtoken.views import obtain_auth_token
from . import views

app_name = "doorway"
urlpatterns = [
    path("register/", views.register_user, name="register-user"),
    path("verify-email/<uuid:token>/", views.verify_email, name="verify-email"),
    path("suffix-check/", views.suffix_check, name="suffix-check"),
    path("auth-test/", views.auth_test, name="auth-test"),
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_user, name="logout"),
]
