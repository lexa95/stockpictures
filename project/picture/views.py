from django.shortcuts import render

# Create your views here.


def pictures(request, username):
    return render(request, 'picture/pictures.html')


def add(request):

    if request.method == 'GET':
        url = request.GET['resource_url']

    elif request.method == 'POST':
        do_something_else()

    return render(request, 'picture/add.html')
