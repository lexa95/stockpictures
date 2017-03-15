from django.conf.urls import url
from .api import *
from .views import pictures, add


urlpatterns = [
    url(r'^api/picutes-in-board/$', PictureInBoard.as_view()),
    url(r'^api/liked-user/$', LikePicture.as_view()),
    url(r'^api/picutes-like/$', PictureLike.as_view()),
    url(r'^api/picutes-save/$', SavePicture.as_view()),
    url(r'^api/picutes-delet/$', DeletPicture.as_view()),
    url(r'^api/picture-from-board/', PicturesFromBoard.as_view()),
    url(r'^api/picture-from-sub-board/', PicturesFromSubBoard.as_view()),
    url(r'^api/picture-created/', CreatedPictures.as_view()),

    url(r'^add/$', add, name='add'),
    url(r'^(?P<username>[-\w]+)/$', pictures, name='boards')
]
