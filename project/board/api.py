from .models import Board, Subscription
from .serializers import BoardSerializer, SubscriptionSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework import permissions


class BoardUser(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            username = request.GET['username']
            user = User.objects.get(username=username)
            board = Board.objects.filter(user=user)
            serializer = BoardSerializer(board, many=True)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class SubscriptionBoardUser(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            username = request.GET['username']
            user = User.objects.get(username=username)
            subscription = Subscription.objects.filter(user=user)
            serializer = SubscriptionSerializer(subscription, many=True)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)