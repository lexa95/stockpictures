from django.conf.urls import include, url
from django.contrib.auth import views
from .views import edit, profile
from .api import UserProfile

urlpatterns = [
    url(r'^$', profile, name='profile'),
    url(r'^edit/$', edit, name='edit_profile'),
    url(r'^api/user-profile/$', UserProfile.as_view(), name='UserProfile')
]

