"""
URL configuration for handshake project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
import project.views
from rest_framework import routers, serializers, viewsets
from doorway.views import UserViewSet, UserProfileViewSet, UserProfileUpdateView
from AdminLists.views import InstitutionViewSet
from AdminLists.views import InterestActivityViewSet
from AdminLists.views import InterestFieldViewSet
from dbsearch.views import search_userprofiles
from project.views import (
    ProjectPostViewSet,
    ProjectViewSet,
    CreateProjectView,
    EditProjectView,
    EditPostView,
    CreatePostView,
    DeletePostView,
    DeleteProjectView
)

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"user-profiles", UserProfileViewSet)
router.register(r"institutions", InstitutionViewSet)
router.register(r"interest-activities", InterestActivityViewSet)
router.register(r"interest-fields", InterestFieldViewSet)
router.register(r"posts", ProjectPostViewSet)
router.register(r"projects", ProjectViewSet)


urlpatterns = [
    path("api/", include(router.urls)),
    path("api/edit-profile/", UserProfileUpdateView.as_view(), name="edit-profile"),
    path("api/create-project/", CreateProjectView.as_view(), name="create-project"),
    path("api/edit-project/", EditProjectView.as_view(), name="edit-project"),
    path("api/delete-project/", DeleteProjectView.as_view(), name="delete-project"),
    path("api/create-post/", CreatePostView.as_view(), name="create-post"),
    path("api/delete-post/", DeletePostView.as_view(), name="delete-post"),
    path("api/edit-post/", EditPostView.as_view(), name='edit-post'),
    path("api/search-profile/", search_userprofiles, name="search-user-profiles"),
    path("api/doorway/", include("doorway.urls")),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("api/admin/", admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
