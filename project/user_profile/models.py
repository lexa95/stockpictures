from django.db import models
from django.conf import settings
from board.models import Board
from django.conf import settings


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    date_of_birth = models.DateField(blank=True, null=True)
    photo = models.ImageField(upload_to='users/%Y/%m/%d', blank=True)

    def __str__(self):
        return 'Profile for user {}'.format(self.user.username)

    def count_boards(self):
        return str(Board.objects.filter(user=self.user).count())

    def get_photo_url(self):
        return self.photo.url
