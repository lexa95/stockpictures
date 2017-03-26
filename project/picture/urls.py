from django.conf.urls import url
from .api import *
from .views import pictures, add


urlpatterns = [
    url(r'^api/picture-data/$', GetPictureData.as_view()),
    url(r'^api/picutes-from-board/$', PicturesFromBoard.as_view()),
    url(r'^api/liked-user/$', UsersLikedPictures.as_view()),
    url(r'^api/picutes-like/$', LikedPictures.as_view()),
    url(r'^api/picutes-save/$', SavedPicture.as_view()),
    url(r'^api/picutes-delet/$', DeletPicture.as_view()),
    url(r'^api/picture-from-board/', PicturesFromBoards.as_view()),
    url(r'^api/picture-from-sub-board/', PicturesFromSubBoards.as_view()),
    url(r'^api/picture-created/', CreatedPictures.as_view()),
    url(r'^api/picture-parse/', ParsePictureFromAtherSite.as_view()),
    url(r'^api/picture-add/', AddPictureFromAtherSite.as_view()),
    url(r'^api/similar-pictures/', SimilarPictures.as_view()),

    url(r'^add/$', add, name='add'),
    url(r'^(?P<username>[-\w]+)/$', pictures, name='picture')
]
