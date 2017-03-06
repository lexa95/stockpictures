from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth import views
from .views import registration


urlpatterns = [
    url(r'^login/$', views.login, {
        'template_name': 'account/login.html',
        'redirect_authenticated_user': True}, name='login'),

    url(r'^logout/$', views.logout, {
        'template_name': 'account/logout.html'}, name='logout'),

    url(r'^password-change/$', views.password_change,
        {'template_name': 'account/password_change.html'},
        name='password_change'),

    url(r'^password-change/done/$', views.password_change_done,
        {'template_name': 'account/password_change_done.html'},
        name='password_change_done'),

    url(r'registration/$', registration, name='registration'),
]

