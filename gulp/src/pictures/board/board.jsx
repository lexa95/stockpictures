var Pictures = require('../modules/pictures_board.jsx')
var BoardHead = require('../modules/head_board.jsx')

var boardInformation, userAuth
var url = window.location.pathname
var boardIdentification = url.split('/')[2]


function getPictures(identification){
    var array

    $.ajax({
        url: '/picture/api/picutes-from-board/',
        dataType: 'json',
        data: {identification: identification,
                range_left: 0,
                rande_right: 100},
        success: function(data){
            array = data
        },
        async:false,
    });
    return array
}

function isAuthBoard(userPage, userAuth){
    return userPage === userAuth.username
}

function getBoardInformation(){
        var url = window.location.pathname
        var identification = url.split('/')[2]
        var user

        $.ajax({
            url: '/board/api/board-information/',
            dataType: 'json',
            data: {identification: identification},
            success: function(data){
                user = data
            },
            async:false,
        });
        return user
}

function getUserAuth(){
    var user;

    $.ajax({
        url: '/user/api/user_profile_auth/',
        dataType: 'json',
        success: function(data){
            user = data
        },
        async:false,
    });

    return user
}

boardInformation = getBoardInformation()
userAuth = getUserAuth()

ReactDOM.render(
    React.createElement(Pictures, {
        identification: boardIdentification, 
        getPictures: getPictures,
        userPage: boardInformation.username,
        isAuthBoard: isAuthBoard,
        userAuth: userAuth,
    }), 
    document.getElementById('pictures')
);


ReactDOM.render(
    React.createElement(BoardHead, {
        boardInformation: boardInformation,
        boardInformationUpdate: getBoardInformation,
        userAuth: userAuth
    }),
    document.getElementById('head-board')
);