from rest_framework import serializers
from .models import Like, InBoard, Picture
from django.db.models.fields import DateField


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


class LikeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = Like
        fields = ('username', 'first_name', 'last_name',)


class PictureSerializer(serializers.ModelSerializer):

    class Meta:
        model = Picture
        fields = ('url', 'name', 'user', 'identification', 'date')