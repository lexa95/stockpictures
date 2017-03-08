from django.conf.urls import url
from .views import board, boards
from .api import BoardUser, SubscriptionBoardUser, AddBoard

urlpatterns = [
    url(r'^api/board-user/$', BoardUser.as_view()),
    url(r'^api/board-user-subscription/$', SubscriptionBoardUser.as_view()),
    url(r'^api/board-add/$', AddBoard.as_view()),

    url(r'^(?P<username>[-\w]+)/(?P<boardname>[A-Za-z0-9_-]+)/$',
        board, name='board'),

    url(r'^(?P<username>[-\w]+)/$', boards, name='boards'),
]
