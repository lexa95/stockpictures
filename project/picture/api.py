# -*- coding: utf-8 -*-

from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework import permissions
from .models import Like, InBoard, Picture
from board.models import Board, Subscription
from .serializers import LikeSerializer, PicturesInBoardSerializer
from .serializers import PictureSerializer
from django.db.models import Q
from django.http import JsonResponse


class PictureInBoard(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:
            board_identification = request.GET['identification']
            board = Board.objects.get(identification=board_identification)

            pictures_in_board = InBoard.objects.filter(board=board)
            serializer = PicturesInBoardSerializer(pictures_in_board,
                                                   many=True)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class LikePicture(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:
            identification = request.GET['identification']
            picture = Picture.objects.get(identification=identification)
            liked_users = Like.objects.filter(picture__=picture)

            serializer = LikeSerializer(liked_users, many=True)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class PictureLike(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:

            username = request.GET['username']
            range_left = int(request.GET['range_left'])
            rande_right = int(request.GET['rande_right'])

            pictures = Picture.objects.filter(
                like__user__username=username).order_by(
                    '-like__date')[range_left:rande_right]

            serializer = PictureSerializer(pictures, many=True)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class PicturesFromBoard(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:
            username = request.GET['username']
            range_left = int(request.GET['range_left'])
            rande_right = int(request.GET['rande_right'])

            pictures = Picture.objects.filter(
                inboard__board__user__username=username
                ).distinct().order_by('-inboard__date')[range_left:rande_right]

            serializer = PictureSerializer(pictures, many=True)
            return Response(serializer.data)
        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class PicturesFromSubBoard(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:
            username = request.GET['username']
            range_left = int(request.GET['range_left'])
            rande_right = int(request.GET['rande_right'])

            pictures = Picture.objects.filter(
                inboard__board__subscription__user__username=username
                ).order_by('-inboard__board__subscription__date')[range_left:rande_right]

            serializer = PictureSerializer(pictures, many=True)
            return Response(serializer.data)
        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class CreatedPictures(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:
            username = request.GET['username']
            range_left = int(request.GET['range_left'])
            rande_right = int(request.GET['rande_right'])

            pictures = Picture.objects.filter(
                user__username=username
                ).distinct().order_by('-date')[range_left:rande_right]

            serializer = PictureSerializer(pictures, many=True)
            return Response(serializer.data)
        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class SavePicture(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            identification_board = request.POST['identification_board']
            identification_picture = request.POST['identification_picture']

            picture = Picture.objects.get(identification=identification_picture)
            board = Board.objects.get(identification=identification_board,
                                      user=request.user)

            in_board = InBoard(board=board, picture=picture)
            in_board.save()

            return JsonResponse({'status': 'ok'})
        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class DeletPicture(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            identification_board = request.POST['identification_board']
            identification_picture = request.POST['identification_picture']

            in_board = InBoard.objects.get(
                board__identification=identification_board,
                picture__identification=identification_picture,
                board__user=request.user)

            in_board.delete()

            return JsonResponse({'status': 'ok'})
        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)