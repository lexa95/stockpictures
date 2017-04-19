(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AddNewBoard = require('./modules/add_new_boards.jsx')
var Board = require('./modules/board.jsx')
var EditBoard = require('./modules/edit_board.jsx')

var Boards = React.createClass({displayName: "Boards",
    getUserAuth: function(){
        var username;

        $.ajax({
            url: '/user/api/user_profile_auth/',
            dataType: 'json',
            success: function(data){
                username = data.username
            },
            async:false,
        });

        return username
    },

    getUserPage: function(){
        var url = window.location.pathname
        var username = url.split('/')[2]
        return username
    },

    getBoards: function(username, url){
        var board

        $.ajax({
            url: url,
            dataType: 'json',
            data: {username: username},
            success: function(data){
                board = data
            },
            async:false,
        });

        return board
    },

    getInitialState: function(){
        var boards, userAuth, userPage, subBoards, isAuth

        userAuth = this.getUserAuth()
        userPage = this.getUserPage()

        isAuth = userAuth !== undefined

        if(window.location.pathname.split('/')[3] === "subscriptions"){
            boards = this.getBoards(userPage, '/board/api/board-user-subscription/')
        }
        else{
            boards = this.getBoards(userPage, '/board/api/board-user/')
        }

        if(isAuth){
            subBoards = this.getBoards(userAuth, '/board/api/board-user-subscription/')
        }
        else{
            subBoards = []
        }
        return {
            userAuth: userAuth,
            userPage: userPage,
            isAuth: isAuth,
            boards: boards,
            subBoards: subBoards,
            changingBoard: {name: '', secret: false},
            isModalOpenChange: false,
        }
    },
    updateBoard: function(){
        if(window.location.pathname.split('/')[3] === "subscriptions"){
            this.setState({boards: this.getBoards(this.state.userPage, '/board/api/board-user-subscription/')})
        }
        else{
            this.setState({boards: this.getBoards(this.state.userPage, '/board/api/board-user/')})
        }
    },
    updateSubBoards: function(){
        if(this.state.isAuth){
            this.setState({subBoards: this.getBoards(this.state.userAuth, '/board/api/board-user-subscription/')})
        }
        else{
            subBoards = []
        }
    },
    updateChangeBoard: function(b){
        this.setState({
            changingBoard: b,
            isModalOpenChange: true,
        })

    },
    render: function(){
        var addNewBoard
        if(this.state.userAuth === this.state.userPage &&
            window.location.pathname.split('/')[3] !== "subscriptions"){
            addNewBoard =   React.createElement("div", {className: "board-block"}, 
                                React.createElement(AddNewBoard, {update: this.updateBoard}), 

                                React.createElement(EditBoard, {board: this.state.changingBoard, 
                                            updateBoard: this.updateBoard, 
                                            isModalOpenChange: this.state.isModalOpenChange})
                            )
        }
        else{
            addNewBoard = React.createElement("div", null)
        }
        var self = this
        var boardList = this.state.boards.map(function(s, i){
            return React.createElement(Board, {board: s, key: i, userAuth: self.state.userAuth, 
                                            isAuth: self.state.isAuth, 
                                            subBoard: self.state.subBoards, 
                                            updateBoard: self.updateBoard, 
                                            updateChangeBoard: self.updateChangeBoard, 
                                            updateSubBoards: self.updateSubBoards})
        })

        return  React.createElement("div", {className: "container"}, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement(EditBoard, {board: this.state.changingBoard, updateBoard: this.updateBoard}), 
                        addNewBoard, 
                        boardList
                    )
                )
    }
});

ReactDOM.render(
    React.createElement(Boards, {}),
    document.getElementById('boards')
);
},{"./modules/add_new_boards.jsx":2,"./modules/board.jsx":3,"./modules/edit_board.jsx":4}],2:[function(require,module,exports){
var Modal = Reactstrap.Modal
var ModalHeader = Reactstrap.ModalHeader
var ModalBody = Reactstrap.ModalBody
var ModalFooter = Reactstrap.ModalFooter
var Button = Reactstrap.Button


var AddNewBoard = React.createClass({displayName: "AddNewBoard",
    getInitialState: function() {
        return {
            boardName: '',
            isSecret: false,
            modal: false
        }
    },

    createBoard: function(){
        var url =  '/board/api/board-add/'
        var data = { name: this.state.boardName, secret: this.state.isSecret }

        $.ajax({
            url: url,
            dataType: 'json',
            method: 'POST',
            data: data,
            error: function(error){
                alert(error.responseJSON.status)
            },
            async:false,
        });
        this.setState({boardName: '', isSecret: false})
        this.toggle();
        this.props.update();
    },

    nameChange: function(event){
        this.setState({boardName: event.target.value});
    },

    secretChange: function(){
        this.setState({ isSecret: !this.state.isSecret });
    },

    toggle: function(){
        this.setState({
            modal: !this.state.modal,
        })
    },

    render: function(){
        return(
            React.createElement("div", null, 
                React.createElement("div", {className: "text-center", onClick: this.toggle}, 
                    React.createElement("div", null, React.createElement("h6", null, "ADD NEW")), 
                    React.createElement("div", {className: "board-cover"}, 
                        React.createElement("img", {src: "/media/board/add-new.jpg", className: "img-fluid"})
                    )
                ), 

                React.createElement(Modal, {isOpen: this.state.modal, toggle: this.toggle, className: "modal-attach-picture"}, 
                    React.createElement(ModalHeader, {toggle: this.toggle}, "CREATE BOARD"), 
                        React.createElement(ModalBody, null, 
                            React.createElement("div", {className: "container-fluid"}, 
                                React.createElement("div", {className: "row"}, 
                                    React.createElement("div", {className: "col-12"}, 
                                        React.createElement("div", {className: "input-group"}, 
                                            React.createElement("span", {className: "input-group-addon input-title", id: "basic-addon1"}, "Name:"), 
                                            React.createElement("input", {type: "text", className: "form-control", value: this.state.boardName, onChange: this.nameChange, required: ""})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-12"}, 
                                        React.createElement("div", {className: "input-group"}, 
                                            React.createElement("label", {className: "required", htmlFor: "id-secter"}, "Secret:"), 
                                            React.createElement("input", {id: "id-secter", type: "checkbox", name: "vehicle", value: this.state.isSecret, onChange: this.secretChange, className: "input-check-box"})
                                        )
                                    )
                                )
                            )
                        ), 
                    React.createElement(ModalFooter, null, 
                        React.createElement(Button, {color: "secondary", onClick: this.toggle}, "Cancel"), 
                        React.createElement(Button, {color: "secondary", onClick: this.createBoard}, "Create")
                    )
                )
            )
        )
    }
});


module.exports = AddNewBoard
},{}],3:[function(require,module,exports){
var Button = Reactstrap.Button

function isIncluded(board, listBoard){
    for(var i=0; i < listBoard.length; i++){
        if(board.identification === listBoard[i].identification){
            return true;
        }
    }
    return false;
}

var EmptyBoard = React.createClass({displayName: "EmptyBoard",
    render: function(){
        return  React.createElement("div", {className: "board-block text-center"}, 
                    React.createElement("h6", null, 
                        React.createElement("a", {href: this.props.url}, this.props.board.name)
                    ), 
                    React.createElement("a", {href: this.props.url}, 
                        React.createElement("img", {src: this.props.board.cover, className: "img-fluid"})
                    )
                )
    }
})

var UnsubBoard = React.createClass({displayName: "UnsubBoard",
    subscribe: function(board){
        $.ajax({
            url: "/board/api/board-subscribe/",
            dataType: 'json',
            data: {identification: this.props.board.identification},
            async: false,
            method: "POST"
        });

        this.props.updateSubBoards()
    },

    render: function(){

        var images = this.props.board.images
        while(images.length < 4){
            images.push({url: "/media/none.jpg"})
        }

        var style = {
            backgroundImage: "url('" + this.props.board.images[0].url + "')"
        };

        return  React.createElement("div", {className: "board-block text-center"}, 
                    React.createElement("a", {href: this.props.url}, 
                        React.createElement("h6", null, 
                            React.createElement("a", {href: this.props.url}, this.props.board.name)
                        ), 
                        React.createElement("div", {className: "board-cover"}, 
                            React.createElement("div", {className: "board-container-first cover-img", style: style}
                            ), 
                            React.createElement("div", {className: "board-container-second"}, 
                                React.createElement("div", {className: "block-inline"}, 
                                    React.createElement("img", {src: this.props.board.images[1].url, className: "img-fluid cover-small-item"}), 
                                    React.createElement("img", {src: this.props.board.images[2].url, className: "img-fluid cover-small-item"}), 
                                    React.createElement("img", {src: this.props.board.images[3].url, className: "img-fluid cover-small-item"})
                                )
                            )
                        )
                    ), 
                    React.createElement("div", null, 
                        React.createElement(Button, {onClick: this.subscribe, size: "sm"}, "SUBSCRIBE")
                    )
                )
    }
});

var SubBoard = React.createClass({displayName: "SubBoard",
    unsubscribe: function(){
        $.ajax({
            url: "/board/api/board-unsubscribe/",
            dataType: 'json',
            data: {identification: this.props.board.identification},
            async: false,
            method: "POST"
        });

        this.props.updateSubBoards()
    },

    render: function(){
        var images = this.props.board.images
        while(images.length < 4){
            images.push({url: "/media/none.jpg"})
        }

        var style = {
            backgroundImage: "url('" + this.props.board.images[0].url + "')"
        };

        return  React.createElement("div", {className: "board-block text-center"}, 
                    React.createElement("a", {href: this.props.url}, 
                        React.createElement("h6", null, 
                            React.createElement("a", {href: this.props.url}, this.props.board.name)
                        ), 
                        React.createElement("div", {className: "board-cover"}, 
                            React.createElement("div", {className: "board-container-first cover-img", style: style}

                            ), 
                            React.createElement("div", {className: "board-container-second"}, 
                                React.createElement("div", {className: "block-inline"}, 
                                    React.createElement("img", {src: this.props.board.images[1].url, className: "img-fluid cover-small-item"}), 
                                    React.createElement("img", {src: this.props.board.images[2].url, className: "img-fluid cover-small-item"}), 
                                    React.createElement("img", {src: this.props.board.images[3].url, className: "img-fluid cover-small-item"})
                                )
                            )
                        )
                    ), 
                    React.createElement("div", null, 
                        /*<button onClick={this.unsubscribe} className='btn-subscriptions'>SUBSCRIBE</button>*/
                        React.createElement(Button, {onClick: this.unsubscribe, size: "sm", color: "danger"}, "SUBSCRIBE")
                    )
                )
    }
});

var MyBoard = React.createClass({displayName: "MyBoard",

    clickChange: function(){
        this.props.updateChangeBoard(this.props.board)
    },

    render: function(){

        var images = this.props.board.images
        while(images.length < 4){
            images.push({url: "/media/none.jpg"})
        }

        var style = {
            backgroundImage: "url('" + this.props.board.images[0].url + "')"
        };

        return  React.createElement("div", {className: "text-center"}, 
                    React.createElement("a", {href: this.props.url}, 
                        React.createElement("h6", null, 
                            React.createElement("a", {href: this.props.url}, this.props.board.name)
                        ), 
                        React.createElement("div", {className: "board-cover"}, 
                            React.createElement("div", {className: "board-container-first cover-img", style: style}

                            ), 
                            React.createElement("div", {className: "board-container-second"}, 
                                React.createElement("div", {className: "block-inline"}, 
                                    React.createElement("img", {src: this.props.board.images[1].url, className: "img-fluid cover-small-item"}), 
                                    React.createElement("img", {src: this.props.board.images[2].url, className: "img-fluid cover-small-item"}), 
                                    React.createElement("img", {src: this.props.board.images[3].url, className: "img-fluid cover-small-item"})
                                )
                            )
                        )
                    ), 
                    React.createElement("div", null, 
                        /*<button onClick={this.clickChange} className='btn-edit' data-toggle="modal" data-target="#edit-board">CHANGE</button>*/
                        React.createElement(Button, {onClick: this.clickChange, size: "sm"}, "CHANGE")
                    )
                )
    }
});

var Board = React.createClass({displayName: "Board",
    getInitialState: function(){
        return {url: '/board/' + this.props.board.identification}
    },

    render: function(){
        var board
        if(!this.props.isAuth){
            board = React.createElement(EmptyBoard, {board: this.props.board})
        }
        else if (this.props.userAuth === this.props.board.username){
            board = React.createElement(MyBoard, {board: this.props.board, updateChangeBoard: this.props.updateChangeBoard, url: this.state.url})
        }
        else if(isIncluded(this.props.board, this.props.subBoard)){
            board = React.createElement(SubBoard, {board: this.props.board, updateSubBoards: this.props.updateSubBoards, url: this.state.url})
        }
        else{
            board = React.createElement(UnsubBoard, {board: this.props.board, updateSubBoards: this.props.updateSubBoards, url: this.state.url})
        }

        return  React.createElement("div", {className: "board-block"}, 
                    board
                )
    }
});


module.exports = Board
},{}],4:[function(require,module,exports){
var Modal = Reactstrap.Modal
var ModalHeader = Reactstrap.ModalHeader
var ModalBody = Reactstrap.ModalBody
var ModalFooter = Reactstrap.ModalFooter
var Button = Reactstrap.Button


var EditBoard = React.createClass({displayName: "EditBoard",
    getInitialState: function() {
        return {
            name: this.props.board.name,
            secret: this.props.board.secret,
            isModalOpenChange: this.props.isModalOpenChange,
            modal: false,
        }
    },

    nameChange: function(event){
        this.setState({
            name: event.target.value
        });
    },

    secretChange: function(event){
        this.setState({secret: event.target.checked});
    },

    editBoard: function(){
        var url =  '/board/api/board-edit/'
        var data = {
            name: this.state.name,
            secret: this.state.secret,
            username: this.props.username,
            oldname: this.props.board.name,
        }

        $.ajax({
            url: url,
            dataType: 'json',
            method: 'POST',
            data: data,
            async:false,
        });

        this.props.updateBoard()
        this.toggle()
    },

    deleteBoard: function(){
        var url =  '/board/api/board-remove/'
        var data = {
                        name: this.props.board.name,
                        username: this.props.username
                   }

        $.ajax({
            url: url,
            dataType: 'json',
            method: 'POST',
            data: data,
            async:false,
        });

        this.props.updateBoard()
        this.toggle()
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            name: nextProps.board.name,
            secret: nextProps.board.secret,
            modal: nextProps.isModalOpenChange,
        });
    },

    toggle: function(){
        this.setState({
            modal: !this.state.modal,
        })
    },

    render: function(){
        return(
            React.createElement("div", null, 
                React.createElement(Modal, {isOpen: this.state.modal, toggle: this.toggle, className: "modal-attach-picture"}, 
                    React.createElement(ModalHeader, {toggle: this.toggle}, "CREATE BOARD"), 
                        React.createElement(ModalBody, null, 
                            React.createElement("div", {className: "container-fluid"}, 
                                React.createElement("div", {className: "row"}, 

                                    React.createElement("div", {className: "col-12"}, 
                                        React.createElement("div", {className: "input-group"}, 
                                            React.createElement("span", {className: "input-group-addon input-title", id: "basic-addon1"}, "Name:"), 
                                            React.createElement("input", {type: "text", className: "form-control", value: this.state.name, onChange: this.nameChange, required: ""})
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-12"}, 
                                        React.createElement("div", {className: "input-group"}, 
                                            React.createElement("label", {className: "required", htmlFor: "id-secter"}, "Secret:"), 
                                            React.createElement("input", {id: "id-secter", type: "checkbox", name: "vehicle", value: this.state.secret, onChange: this.secretChange, className: "input-check-box"})
                                        )
                                    )

                                )
                            )
                        ), 
                    React.createElement(ModalFooter, null, 
                        React.createElement(Button, {color: "secondary", onClick: this.deleteBoard}, "Delete"), 
                        React.createElement(Button, {color: "secondary", onClick: this.editBoard}, "Save changes")
                    )
                )
            )
        )
    }
});


module.exports = EditBoard
},{}]},{},[1]);
