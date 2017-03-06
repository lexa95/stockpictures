from django.shortcuts import render


def boards(request, username):
    return render(request, 'board/boards.html')


def board(request, username, boardname):
    return render(request, 'board/board.html')

