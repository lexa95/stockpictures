from .models import Profile
from .serializers import ProfileSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework import permissions


class UserProfile(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:
            username = request.GET['username']
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class UserProfileList(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            profile = Profile.objects.all()
            serializer = ProfileSerializer(profile, many=True)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class UserProfileAuth(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            user = request.user
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)