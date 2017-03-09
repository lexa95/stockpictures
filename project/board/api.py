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

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

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
            print(user)
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

            new_board = Board(name=name, secret=secret, user=request.user)
            new_board.save()

            return JsonResponse({'status': 'ok'})

        except IntegrityError:
            return JsonResponse(
                {'status': 'you already have a Board with that name'},
                status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class EditBoard(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            name = request.POST['name']
            secret = request.POST['secret'] == 'true'
            oldname = request.POST['oldname']

            board = Board.objects.get(user=request.user, name=oldname)
            board.name = name
            board.secret = secret
            board.save()

            return JsonResponse({'status': 'ok'})
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RemodeBoard(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            name = request.POST['name']
            board = Board.objects.get(user=request.user, name=name)

            board.delete()

            return JsonResponse({'status': 'ok'})
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UnsubscribeBoard(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def post(self, request):
        try:
            identification = request.POST['identification']

            subscribe = Subscription.objects.get(
                board__identification=identification, user=request.user)
            subscribe.delete()
            return JsonResponse({'status': 'ok'})
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SubscribeBoard(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def post(self, request):
        try:
            identification = request.POST['identification']
            board = Board.objects.get(identification=identification)

            subscribe = Subscription(board=board, user=request.user)
            subscribe.save()
            return JsonResponse({'status': 'ok'})
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)