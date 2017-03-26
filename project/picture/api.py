# -*- coding: utf-8 -*-

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework import permissions
from .models import Like, InBoard, Picture
from board.models import Board, Subscription
from .serializers import *
from bs4 import BeautifulSoup
import requests


class PicturesFromBoard(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:
            board_identification = request.GET['identification']
            print(board_identification)
            board = Board.objects.get(identification=board_identification)
            pictures_in_board = InBoard.objects.filter(board=board)

            serializer = PicturesInBoardSerializer(pictures_in_board,
                                                   many=True)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class UsersLikedPictures(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:
            identification_picture = request.GET['identification']

            liked_users = User.objects.filter(
                like__picture__identification=identification_picture)

            serializer = UserSerializer(liked_users, many=True)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class LikedPictures(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:
            username = request.GET['username']
            range_left = int(request.GET['range_left'])
            rande_right = int(request.GET['rande_right'])

            likes = Like.objects.filter(
                user__username=username).order_by(
                    '-date')[range_left:rande_right]

            serializer = LikedPicturesSerializer(likes, many=True)

            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class PicturesFromBoards(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        try:
            username = request.GET['username']
            range_left = int(request.GET['range_left'])
            rande_right = int(request.GET['rande_right'])

            # pictures = Picture.objects.filter(
            #     inboard__board__user__username=username
            #     ).distinct().order_by('-inboard__date')[range_left:rande_right]

            # serializer = PictureSerializer(pictures, many=True)

            inboards = InBoard.objects.filter(
                board__user__username=username
            ).order_by('-date')[range_left:rande_right]

            serializer = PicturesFromBoardsSerializer(inboards, many=True)

            return Response(serializer.data)
        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class PicturesFromSubBoards(APIView):
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


class SavedPicture(APIView):
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

            return Response({'status': 'ok'})
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

            return Response({'status': 'ok'})
        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class ParsePictureFromAtherSite(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request):
        resource_url = request.GET['resource_url']

        r = requests.get(resource_url, auth=('user', 'pass'))
        soup = BeautifulSoup(r.text, 'html.parser')

        collect = soup.find('body')
        images = collect.findAll('img')

        return Response({'src': [img.get('src') for img in images]})


class AddPictureFromAtherSite(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def post(self, requests):
        board_identification = requests.POST['board_identification']
        url_picture = requests.POST['url_picture']
        url_resource = requests.POST['url_resource']
        picture_name = requests.POST['picture_name']

        picture = Picture(name=picture_name, user=requests.user,
                          resource_url=url_resource, url=url_picture)

        picture.save()
        board = Board.objects.get(user=requests.user,
                                  identification=board_identification)

        inBoard = InBoard(board=board, picture=picture)
        inBoard.save()

        return Response({'result': 'ок'})


class GetPictureData(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def get(self, requests):
        picture_identification = requests.GET['identification']
        picture = Picture.objects.get(identification=picture_identification)

        serializer = PictureSerializer(picture)
        return Response(serializer.data)


class SimilarPictures(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def get(self, requests):
        picture_identification = requests.GET['identification']
        print(picture_identification)
        boards = Board.objects.filter(
            inboard__picture__identification=picture_identification)

        pictures = Picture.objects.filter(inboard__board__in=boards)
        print(pictures)
        serializer = PictureSerializer(pictures, many=True)
        return Response(serializer.data)