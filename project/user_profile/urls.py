from django.conf.urls import include, url
from django.contrib.auth import views
from .views import edit, profile
from .api import UserProfile, UserProfileList, UserProfileAuth

urlpatterns = [
    url(r'^$', profile, name='profile'),
    url(r'^edit/$', edit, name='edit_profile'),
    url(r'^api/user-profile/$', UserProfile.as_view(), name='user_profile'),
    url(r'^api/user-profile_list/$', UserProfileList.as_view(),
        name='user_profile_list'),
    url(r'^api/user_profile_auth/$', UserProfileAuth.as_view(),
        name='user_profile_auth'),
]

