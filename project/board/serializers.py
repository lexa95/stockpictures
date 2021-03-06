from rest_framework import serializers
from .models import Subscription, Board
from picture.models import InBoard, Picture
import json


class PictureUrlSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ('url', )


class BoardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    count_pictures = serializers.SerializerMethodField()
    count_follower = serializers.SerializerMethodField()
    is_editing = serializers.SerializerMethodField()
    is_subscription = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ('username', 'name', 'cover', 'secret', 'identification',
                  'count_pictures', 'count_follower', 'is_editing', 'is_subscription', 'images')

    def get_count_pictures(self, obj):
        return InBoard.objects.filter(board=obj).count()

    def get_count_follower(self, obj):
        return Subscription.objects.filter(board=obj).count()

    def get_is_editing(self, obj):
        request = self.context.get("request")
        return request.user == obj.user

    def get_is_subscription(self, obj):
        request = self.context.get("request")
        user = request.user
        return Subscription.objects.filter(user=user, board=obj).exists()

    def get_images(self, obj):
        print(obj)
        images = list(Picture.objects.filter(inboard__board=obj)[:4])
        print(PictureUrlSerializer(images, many=True))
        return PictureUrlSerializer(images, many=True).data


class SubscriptionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='board.user.username')
    name = serializers.CharField(source='board.name')
    cover = serializers.CharField(source='board.cover')
    identification = serializers.CharField(source='board.identification')

    class Meta:
        model = Subscription
        fields = ('username', 'name', 'cover', 'identification')
