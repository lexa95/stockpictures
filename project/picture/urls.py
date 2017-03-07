from django.conf.urls import url
from .api import PictureInBoard, LikePicture

urlpatterns = [
    url(r'^api/picutes-in-board/$', PictureInBoard.as_view()),
    url(r'^api/liked-user/$', LikePicture.as_view()),
]
