from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    second_name = serializers.CharField(source='user.second_name')

    class Meta:
        model = Profile
        fields = ('username', 'first_name', 'second_name', 'photo')
