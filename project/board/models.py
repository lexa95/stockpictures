from django.db import models
from django.contrib.auth.models import User
from django.forms import ValidationError
from django import forms
from django.core.exceptions import ValidationError
# Create your models here.


class Board(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=30)
    created_date = models.DateField(auto_now_add=True)
    secret = models.BooleanField(default=False)
    cover = models.ImageField(upload_to='board', default='board/none.jpg')

    def __str__(self):
        return self.name


class Subscription(models.Model):
    user = models.ForeignKey(User)
    board = models.ForeignKey(Board)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.user.username + '->' + self.board.name

    def clean(self, *args, **kwargs):
        super(Subscription, self).clean()
        if self.user == self.board.user:
            raise ValidationError('User is creator this board')

    def save(self, *args, **kwargs):
        if self.user == self.board.user:
            return

        super(Subscription, self).save(*args, **kwargs)

    class Meta:
        unique_together = (("user", "board"),)
