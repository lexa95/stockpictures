from rest_framework import serializers
from .models import Subscription, Board


class BoardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')

    class Meta:
        model = Board
        fields = ('username', 'name', 'cover', 'secret', 'identification')


class SubscriptionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='board.user.username')
    name = serializers.CharField(source='board.name')
    cover = serializers.CharField(source='board.cover')
    identification = serializers.CharField(source='board.identification')

    class Meta:
        model = Subscription
        fields = ('username', 'name', 'cover', 'identification')
