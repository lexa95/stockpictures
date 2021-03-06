from django.shortcuts import render
from .forms import UserEditForm, ProfileEditForm
from django.contrib.auth.decorators import login_required
# Create your views here.


@login_required
def edit(request):
    if request.method == 'POST':
        user_form = UserEditForm(instance=request.user, data=request.POST)
        profile_form = ProfileEditForm(
            instance=request.user.profile, data=request.POST,
            files=request.FILES)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
    else:
        user_form = UserEditForm(instance=request.user)
        profile_form = ProfileEditForm(instance=request.user.profile)

    return render(request, 'profile/edit.html', {
        'user_form': user_form, 'profile_form': profile_form})


def profile(request):

    return render(request, 'profile/profile.html', {
        'user': request.user, 'profile': request.user.profile})


def boards(request, username):
    return render(request, 'profile/boards.html')


def subscriptions(request, username):
    return render(request, 'profile/subscriptions.html')


def pictures(request, username):
    return render(request, 'profile/pictures.html')


def likes(request, username):
    return render(request, 'profile/likes.html')
