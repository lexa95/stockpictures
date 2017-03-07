from django.shortcuts import render
from django.http import HttpResponse
from .forms import UserRegistrationForm
from user_profile.models import Profile


def index(request):
    return render(request, 'account/index.html')


def registration(request):
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        if user_form.is_valid():
            new_user = user_form.save(commit=False)
            new_user.set_password(user_form.cleaned_data['password'])
            new_user.save()
            profile = Profile.objects.create(user=new_user)

            return render(
                request, 'account/registration_done.html',
                {'new_user': new_user})
    else:
        user_form = UserRegistrationForm()

    return render(
        request, 'account/registration.html', {'user_form': user_form})
