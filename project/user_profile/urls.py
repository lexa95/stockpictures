from django.conf.urls import include, url
from django.contrib.auth import views
from .views import edit, profile


urlpatterns = [
    url(r'^$', profile, name='profile'),
    url(r'^edit/$', edit, name='edit_profile'),
]

