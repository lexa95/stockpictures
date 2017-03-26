from django.shortcuts import render
from django.views.generic import TemplateView


def pictures(request, username):
    return render(request, 'picture/picture.html')


def add(request):
    return render(request, 'picture/add.html')
