var Pictures = require('../modules/pictures_board.jsx')

var url = window.location.pathname
var boardIdentification = url.split('/')[2]
var userAuth

function getPictures(identification){
    var array
    
    $.ajax({
        url: '/picture/api/picture-from-board/',
        dataType: 'json',
        data: {username: identification,
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
    return false
}

function getUserPage(){
        var url = window.location.pathname
        var username = url.split('/')[2]
        return username
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

userAuth = getUserAuth()

ReactDOM.render(
    React.createElement(Pictures, {
        identification: boardIdentification, 
        getPictures: getPictures,
        userPage: getUserPage(),
        isAuthBoard: isAuthBoard,
        userAuth: userAuth,
    }), 
    document.getElementById('pictures')
);