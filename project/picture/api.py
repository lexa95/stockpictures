from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework import permissions
from .models import Like, InBoard, Picture
from board.models import Board
from .serializers import LikeSerializer, PicturesInBoardSerializer


class PictureInBoard(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            username = request.GET['username']
            user = User.objects.get(username=username)

            boardname = request.GET['boardname']
            board = Board.objects.get(user=user, name=boardname)

            pictures_in_board = InBoard.objects.filter(board=board)
            serializer = PicturesInBoardSerializer(pictures_in_board,
                                                   many=True)
            return Response(serializer.data)

        except:
            return Response(
                status=status.HTTP_400_BAD_REQUEST)


class LikePicture(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # try:
        identification = request.GET['identification']
        picture = Picture.objects.get(identification=identification)
        liked_users = Like.objects.filter(picture=picture)

        serializer = LikeSerializer(liked_users, many=True)
        return Response(serializer.data)

        # except:
        #     return Response(
        #         status=status.HTTP_400_BAD_REQUEST)
