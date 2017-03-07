from rest_framework import serializers
from .models import Like, InBoard, Picture


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
                  'name')


class LikeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    # user_img = serializers.CharField(source='user.profile.user_img')

    class Meta:
        model = Like
        fields = ('username', 'first_name', 'last_name',)
