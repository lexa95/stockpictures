from django.shortcuts import render


def boards(request, username):
    return render(request, 'board/boards.html')


def board(request, username, boardid):
    return render(request, 'board/board.html')


def subscriptions(request, username):
    return render(request, 'board/subscriptions.html')