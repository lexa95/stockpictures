from rest_framework import serializers
from .models import Like, InBoard, Picture
from board.models import Subscription
from django.db.models.fields import DateField
from django.contrib.auth.models import User


class PicturesInBoardSerializer(serializers.ModelSerializer):
    boardname = serializers.CharField(source='board.name')
    resource_url = serializers.CharField(source='picture.resource_url')
    url = serializers.CharField(source='picture.url')
    user = serializers.CharField(source='picture.user.username')
    identification = serializers.CharField(source='picture.identification')
    name = serializers.CharField(source='picture.name')

    class Meta:
        model = InBoard
        fields = ('boardname', 'resource_url', 'url', 'user', 'identification',
                  'name', 'date')


class PictureSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username')
    user_avatar = serializers.CharField(source='user.profile.photo.url')

    class Meta:
        model = Picture
        fields = ('url', 'name', 'user', 'identification', 'date',
                  'user_avatar')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', )


class LikedPicturesSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='picture.url')
    name = serializers.CharField(source='picture.name')
    user = serializers.CharField(source='picture.user')
    identification = serializers.CharField(source='picture.identification')

    class Meta:
        model = Like
        fields = ('url', 'name', 'user', 'identification', 'date')


class PicturesFromBoardsSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='picture.url')
    name = serializers.CharField(source='picture.name')
    user = serializers.CharField(source='picture.user')
    identification = serializers.CharField(source='picture.identification')

    class Meta:
        model = InBoard
        fields = ('url', 'name', 'user', 'identification', 'date')


class PicturesFromSubBoardsSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='picture.url')
    name = serializers.CharField(source='picture.name')
    user = serializers.CharField(source='picture.user')
    identification = serializers.CharField(source='picture.identification')

    class Meta:
        model = Subscription
        fields = ('url', 'name', 'user', 'identification', 'date')
