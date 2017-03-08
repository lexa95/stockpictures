from .models import Board, Subscription
from .serializers import BoardSerializer, SubscriptionSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework import permissions
from django.http import JsonResponse
from django.db.utils import IntegrityError


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


class AddBoard(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            name = request.POST['name']
            secret = request.POST['secret'] == 'true'

            print(secret)
            new_board = Board(name=name, secret=secret, user=request.user)
            new_board.save()

            return JsonResponse({'status': 'ok'})

        except IntegrityError:
            return JsonResponse(
                {'status': 'you already have a Board with that name'},
                status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(type(e))
            return Response(
                status=status.HTTP_400_BAD_REQUEST)
