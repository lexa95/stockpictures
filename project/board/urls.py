from django.conf.urls import url
from .views import board, boards


urlpatterns = [
    # url(r'^api/board-user/$', BoardList.as_view()),
    # url(r'^api/board-user-subscription/$', BoardSubscriptionList.as_view()),
    # url(r'^api/add-board/$', AddBoard.as_view()),

    url(r'^(?P<username>[-\w]+)/(?P<boardname>[A-Za-z0-9_-]+)/$',
        board, name='board'),

    url(r'^(?P<username>[-\w]+)/$', boards, name='boards'),
]