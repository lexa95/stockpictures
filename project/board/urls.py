from django.conf.urls import url
from .views import board
from .api import BoardUser, SubscriptionBoardUser, AddBoard, EditBoard
from .api import RemodeBoard, UnsubscribeBoard, SubscribeBoard
from .api import BoardInformation


urlpatterns = [
    url(r'^api/board-information/$', BoardInformation.as_view()),
    url(r'^api/board-user/$', BoardUser.as_view()),
    url(r'^api/board-user-subscription/$', SubscriptionBoardUser.as_view()),
    url(r'^api/board-add/$', AddBoard.as_view()),
    url(r'^api/board-edit/$', EditBoard.as_view()),
    url(r'^api/board-remove/$', RemodeBoard.as_view()),
    url(r'^api/board-subscribe/$', SubscribeBoard.as_view()),
    url(r'^api/board-unsubscribe/$', UnsubscribeBoard.as_view()),

    url(r'^(?P<boardid>[-\w]+)/$', board, name='board'),
]