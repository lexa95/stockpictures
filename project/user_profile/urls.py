from django.conf.urls import include, url
from django.contrib.auth import views
from .views import edit, profile, subscriptions, boards, pictures, likes
from .api import UserProfile, UserProfileList, UserProfileAuth

urlpatterns = [
    url(r'^$', profile, name='profile'),
    url(r'^edit/$', edit, name='edit_profile'),

    url(r'^(?P<username>[-\w]+)/subscriptions/$',
        subscriptions, name='subscriptions'),

    url(r'^(?P<username>[-\w]+)/boards/$', boards, name='boards'),
    url(r'^(?P<username>[-\w]+)/likes/$', likes, name='likes'),
    url(r'^(?P<username>[-\w]+)/pictures/$', pictures, name='pictures'),

    url(r'^api/user-profile/$', UserProfile.as_view(), name='user_profile'),
    url(r'^api/user-profile_list/$', UserProfileList.as_view(),
        name='user_profile_list'),
    url(r'^api/user_profile_auth/$', UserProfileAuth.as_view(),
        name='user_profile_auth'),
]
