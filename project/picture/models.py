from django.db import models
from django.contrib.auth.models import User
from board.models import Board
from uuid import uuid4
import os


def generate_slug(model):
    unique_slug = uuid4().hex

    while model.objects.filter(identification=unique_slug).exists():
        unique_slug = uuid4().hex

    return unique_slug


class Picture(models.Model):
    identification = models.SlugField(unique=True, blank=True, null=True)
    user = models.ForeignKey(User)
    resource_url = models.URLField()
    url = models.URLField()
    name = models.CharField(max_length=30, blank=True, null=True)
    description = models.TextField(max_length=200, blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.identification

    def save(self, *args, **kwargs):
        if(self.identification == '' or self.identification is None):
            self.identification = generate_slug(Picture)
        super(Picture, self).save(*args, **kwargs)

    class Meta:
        unique_together = (("url"),)


class Like(models.Model):
    picture = models.ForeignKey(Picture)
    user = models.ForeignKey(User)
    date = models.DateTimeField(auto_now_add=True)
    # auto_now_add=True

    def __str__(self):
        return self.user.username + ' ' + self.picture.name

    class Meta:
        unique_together = (("picture", "user"),)


class InBoard(models.Model):
    board = models.ForeignKey(Board)
    picture = models.ForeignKey(Picture)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.board.name + ' ' + self.picture.name

    class Meta:
        unique_together = (("board", "picture"),)
