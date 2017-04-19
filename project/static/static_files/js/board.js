(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{"../modules/head_board.jsx":5,"../modules/pictures_board.jsx":8}],3:[function(require,module,exports){
var AddPicture = React.createClass({displayName: "AddPicture",
    getInitialState: function(){
        return{
            resource_url: '',
            arr_pictres: []
        }
    },

    render: function(){
        return  React.createElement("div", {className: "column"}, 
                    React.createElement("a", {href: "/picture/add/", className: "board-cover"}, 
                        React.createElement("img", {src: "/media/board/add-new.jpg", className: "img-fluid"})
                    )
                )
    }
});

module.exports = AddPicture
},{}],4:[function(require,module,exports){
var Modal = Reactstrap.Modal
var ModalHeader = Reactstrap.ModalHeader
var ModalBody = Reactstrap.ModalBody
var ModalFooter = Reactstrap.ModalFooter
var Button = Reactstrap.Button


var SaveBoard = React.createClass({displayName: "SaveBoard",
    getInitialState: function(){
        return({})
    },

    save: function(){
        this.props.save(this.props.board)
    },

    render: function(){
        var images = this.props.board.images
        while(images.length < 1){
            images.push({url: "/media/none.jpg"})
        }

        var style = {
            backgroundImage: "url('" + this.props.board.images[0].url + "')"
        };

        return  React.createElement("div", {className: "add-board-item"}, 
                    React.createElement("div", {className: "board-cover-sm"}, 
                        React.createElement("div", {className: "board-container-first-sm cover-img", style: style}
                        )
                    ), 
                    React.createElement("span", {className: "add-board-name"}, this.props.board.name), 
                    React.createElement(Button, {onClick: this.save, size: "sm", color: "danger"}, "SAVE")
                )
    }
});

var SaveBoards = React.createClass({displayName: "SaveBoards",
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
        var board = this.getBoards(this.props.user_auth.username, '/board/api/board-user/')

        return {
            picture: this.props.picture,
            board: board,
            modal: this.props.isOpen,
        };
    },

    toggle: function(){
        this.setState({
            modal: !this.state.modal
        })
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            picture: nextProps.picture,
            modal: nextProps.isOpen,
        });
    },

    save: function(board){
        $.ajax({
            method: "POST",
            url: '/picture/api/picutes-save/',
            dataType: 'json',
            data: {'identification_board': board.identification,
                   'identification_picture': this.state.picture.identification},
            async:false,
        })

        this.setState({
            modal: false,
        });
    },

    render: function(){
        self = this
        var list_board = this.state.board.map(function(s, i){
            return React.createElement(SaveBoard, {board: s, key: i, save: self.save})
        })

        return React.createElement("div", null, 
                    React.createElement(Modal, {isOpen: this.state.modal, toggle: this.toggle, className: "modal-attach-picture", size: "lg"}, 
                        React.createElement(ModalHeader, {toggle: this.toggle}, "SAVE BOARD"), 
                            React.createElement(ModalBody, null, 
                                React.createElement("div", {className: "container-fluid"}, 
                                    React.createElement("div", {className: "row"}, 
                                        React.createElement("div", {className: "col-7 vcenter"}, 
                                            React.createElement("div", null, 
                                                React.createElement("img", {src: this.props.picture.url, alt: "", className: "img-fluid"})
                                            )
                                        ), 
                                        React.createElement("div", {className: "col-5 vcenter"}, 
                                            list_board
                                        )
                                    )
                                )
                            ), 
                        React.createElement(ModalFooter, null, 
                            React.createElement(Button, {color: "secondary", onClick: this.toggle}, "Cancel")
                        )
                    )
                )
    }
});


module.exports = SaveBoards
},{}],5:[function(require,module,exports){
var EditBoard = require('./../../boards/modules/edit_board.jsx')
var Button = Reactstrap.Button

var UnsubBoard = React.createClass({displayName: "UnsubBoard",
    subscribe: function(board){
        $.ajax({
            url: "/board/api/board-subscribe/",
            dataType: 'json',
            data: {identification: this.props.boardIdentification},
            async: false,
            method: "POST"
        });

        this.props.update()
    },

    render: function(){
        return(
            React.createElement("div", {className: "board-block text-center"}, 
                React.createElement("div", null, 
                    React.createElement(Button, {onClick: this.subscribe, size: "sm"}, "SUBSCRIBE")
                )
            )
        )
    }
});

var SubBoard = React.createClass({displayName: "SubBoard",
    unsubscribe: function(){
        $.ajax({
            url: "/board/api/board-unsubscribe/",
            dataType: 'json',
            data: {identification: this.props.boardIdentification},
            async: false,
            method: "POST"
        });

        this.props.update()
    },

    render: function(){
        return(
            React.createElement("div", {className: "board-block text-center"}, 
                React.createElement("div", null, 
                    React.createElement(Button, {onClick: this.unsubscribe, size: "sm", color: "danger"}, "SUBSCRIBE")
                )
            )
        )
    }
});

var MyBoard = React.createClass({displayName: "MyBoard",
    render: function(){
        return(
            React.createElement("div", {className: "board-block text-center"}, 
                React.createElement("div", null, 
                    React.createElement(Button, {onClick: this.props.clickHandler, size: "sm"}, "CHANGE")
                )
            )
        )
    }
});

var BoardHead = React.createClass({displayName: "BoardHead",
    getInitialState: function(){
        var isAuth = this.props.userAuth.username !== undefined
        return {
            isAuth: isAuth,
            boardInformation: this.props.boardInformation,
            isModalOpenChange: false,
        }
    },

    update: function(){
        var boardInformation = this.props.boardInformationUpdate()
        this.setState({
            boardInformation: boardInformation,
        })
    },

    clickChangeHandler: function(){
        this.setState({
            isModalOpenChange: true,
        })
    },

    render: function(){
        var url = "/user/" + this.props.boardInformation.username + "/boards/"
        var actionButton = React.createElement("div", null)

        if(this.state.isAuth){
            if(this.state.boardInformation.is_editing){
                actionButton = React.createElement(MyBoard, {clickHandler: this.clickChangeHandler})
            }
            else{
                if(this.state.boardInformation.is_subscription){
                    actionButton = React.createElement(SubBoard, {update: this.update, boardIdentification: this.state.boardInformation.identification})
                }
                else{
                    actionButton = React.createElement(UnsubBoard, {update: this.update, boardIdentification: this.state.boardInformation.identification})
                }
            }
        }

        return(
            React.createElement("div", {className: "container-fluid"}, 
                React.createElement(EditBoard, {board: this.state.boardInformation, 
                           updateBoard: this.update, 
                           isModalOpenChange: this.state.isModalOpenChange}), 

                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-2"}, 
                        React.createElement("a", {href: url, className: ""}, 
                            React.createElement("i", {className: "fa fa-angle-left", "aria-hidden": "true"}), 
                            React.createElement("span", {className: "user_name"}, 
                                this.props.boardInformation.username
                            )
                        )
                    ), 
                    React.createElement("div", {className: "col-8 text-center"}, 
                        React.createElement("h2", null, 
                            this.state.boardInformation.name
                        ), 

                        React.createElement("div", null, 
                            React.createElement("span", {className: "block-information"}, 
                                "Pictures:  ", React.createElement("span", null, this.state.boardInformation.count_pictures)
                            ), 
                            React.createElement("span", {className: "block-information"}, 
                                "Follower: ", React.createElement("span", null, this.props.boardInformation.count_follower)
                            )
                        ), 
                        React.createElement("div", null, 
                            actionButton
                        )
                    )
                )
            )
        )
    }
});

module.exports = BoardHead
},{"./../../boards/modules/edit_board.jsx":1}],6:[function(require,module,exports){
class Masonry extends React.Component{
    constructor(props){
        super(props);
        this.state = {columns: 1};
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount(){
        this.onResize();
        window.addEventListener('resize', this.onResize)
    }

    getColumns(w){
        return this.props.brakePoints.reduceRight( (p, c, i) => {
            return c < w ? p : i;
        }, this.props.brakePoints.length) + 1;
    }

    onResize(){
        const columns = this.getColumns(this.refs.Masonry.offsetWidth);
        if(columns !== this.state.columns){
            this.setState({columns: columns});
        }
    }

    mapChildren(){
        let col = [];
        const numC = this.state.columns;
        for(let i = 0; i < numC; i++){
            col.push([]);
        }
        return this.props.children.reduce((p,c,i) => {
            p[i%numC].push(c);
            return p;
        }, col);
    }

    render(){
        return (
            React.createElement("div", {className: "masonry", ref: "Masonry"}, 
                this.mapChildren().map((col, ci) => {
                    return (
                        React.createElement("div", {className: "column", key: ci}, 
                            col.map((child, i) => {
                                return React.createElement("div", {key: i}, child)
                            })
                        )
                    )
                })
            )
        )
    }
}

module.exports = Masonry;
},{}],7:[function(require,module,exports){
var Button = Reactstrap.Button;

function isIncluded(picture, listPicture){

    for(var i=0; i < listPicture.length; i++){
        if(picture.identification === listPicture[i].identification){
            return true;
        }
    }
    return false;
}

var Picture = React.createClass({displayName: "Picture",

    getInitialState: function(){
        console.log(this.props.picture)
        return {
            isDisplay: !isIncluded(this.props.picture, this.props.pictures),
            picturePageUrl: '/picture/' + this.props.picture.identification,
        }
    },

    remove: function(){
        $.ajax({
            method: "POST",
            url: '/picture/api/picutes-delet/',
            dataType: 'json',
            data: {'identification_board': this.props.board_id,
                   'identification_picture': this.props.picture.identification},
            async:false,
        })


        this.props.updatePicture()
    },

    attach: function(){
        this.props.handlerAttach(this.props.picture)
    },

    edit: function(){
    },

    render: function(){
        var remove_btn, attach_btn, edit_btn

        if(!this.props.is_auth){
            actions = React.createElement("span", null)
        }
        else{
            if(this.props.is_auth_board){
                remove_btn = React.createElement(Button, {color: "danger", size: "sm", onClick: this.remove}, "REMOVE")
            }
            else{
                attach_btn = React.createElement(Button, {onClick: this.attach, size: "sm"}, "SAVE")
            }

            // if(this.props.auth_username == this.props.picture.user){
            //     edit_btn = <Button onClick={this.edit} size="sm">edit</Button>
            // }
        }

        if(this.state.isDisplay){
            return(
                React.createElement("div", null, 
                    React.createElement("div", {className: "img-in-grid"}, 
                        React.createElement("a", {href: this.state.picturePageUrl}, 
                            React.createElement("img", {src: this.props.picture.url, alt: "", className: "img-fluid"})
                        )
                    ), 
                    React.createElement("div", {className: "buttons-from-block"}, 
                        remove_btn, 
                        attach_btn, 
                        edit_btn
                    )
                )
            )
        }
        else{
            return React.createElement("div", null)
        }
    }
});

module.exports = Picture
},{}],8:[function(require,module,exports){
var Picture = require('../modules/picture.jsx')
var AddPicture = require('../modules/add_picture.jsx')
var AttachPicture = require('../modules/attach_picture.jsx')
var Masonry = require('../modules/masonry.jsx')


var Pictures = React.createClass({displayName: "Pictures",

    getInitialState: function(){
        var pictures = this.props.getPictures(this.props.identification)
        var userAuth = this.props.userAuth
        var isAuth = userAuth.username !== undefined
        var isAuthBoard = this.props.isAuthBoard(this.props.userPage, userAuth)

        return {
            pictures: pictures,
            isAuth: isAuth,
            isAuthBoard: isAuthBoard,
            savingPicture: {},
            userAuth: userAuth,
            isOpenAttach: false,
            brakePoints: [350, 500, 750, 1000]
        }
    },

    setSavingPicture: function(picture){
        this.setState({
            savingPicture: picture,
            isOpenAttach: true
        })

    },

    updatePicture: function(){
        var pictures = this.props.getPictures(this.props.identification)
        this.setState({pictures: pictures});
    },

    render: function(){

        if(this.state.isAuthBoard){
            var addPicture = React.createElement(AddPicture, null)
        }
        else{
            var addPicture = React.createElement("span", null)
        }

        self = this
        var listPictures = this.state.pictures.map(function(s, i){
            return React.createElement(Picture, {picture: s, key: i, pictures: self.state.pictures.slice(i+1), 
                                                is_auth: self.state.isAuth, 
                                                is_auth_board: self.state.isAuthBoard, 
                                                handlerAttach: self.setSavingPicture, 
                                                board_id: self.props.identification, 
                                                updatePicture: self.updatePicture, 
                                                auth_username: self.state.userAuth.username})

        });
        return  React.createElement("div", null, 
                    React.createElement(AttachPicture, {picture: this.state.savingPicture, 
                                    user_auth: this.state.userAuth, 
                                    isOpen: this.state.isOpenAttach}), 

                    React.createElement(Masonry, {brakePoints: this.state.brakePoints}, 
                        listPictures
                    )
               )
    }
});

module.exports = Pictures
},{"../modules/add_picture.jsx":3,"../modules/attach_picture.jsx":4,"../modules/masonry.jsx":6,"../modules/picture.jsx":7}]},{},[2]);
