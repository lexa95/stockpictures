(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Button          = Reactstrap.Button
var AttachPicture   = require('../pictures/modules/attach_picture.jsx')
var SimilarPicture  = require('../pictures/modules/picture.jsx')
var Masonry         = require('../pictures/modules/masonry.jsx')

var Picture = React.createClass({displayName: "Picture",
    getIdentificationPicture: function(){
        var url = window.location.pathname
        var identification = url.split('/')[2]
        return identification
    },

    getPictureData: function(identification){
        var data, url, pictureData
        url = '/picture/api/picture-data/'
        data = {
            identification: identification
        }

        $.ajax({
            url: url,
            dataType: 'json',
            data: data,
            success: function(data){
                pictureData = data
            },
            async:false,
        });
        return pictureData
    },

    getSimilarPicture: function(identification){
        var data, url, pictureData
        url = '/picture/api/similar-pictures/'
        data = {
            identification: identification
        }

        $.ajax({
            url: url,
            dataType: 'json',
            data: data,
            success: function(data){
                pictureData = data
            },
            async:false,
        });

        return pictureData
    },

    clickSave: function(){
        this.setState({
            savingPicture: this.state.pictureData,
            isOpenAttach: true
        })
    },

    getInitialState: function(){
        return {
            pictureData: this.getPictureData(this.getIdentificationPicture()),
            isOpenAttach: false,
            savingPicture: {},
            pictures: this.getSimilarPicture(this.getIdentificationPicture()),
            brakePoints: [350, 500, 750, 1000]
        }
    },

    setSavingPicture: function(p){
        this.setState({
            savingPicture: p,
            isOpenAttach: true
        })
    },

    updatePicture: function(){
    },

    render: function(){

        var divStyleBackground = {
            backgroundImage: 'url(' + this.state.pictureData.user_avatar + ')'
        }

        var userUrl = '/user/' + this.state.pictureData.user + '/boards/'

        var self = this
        var listPictures = this.state.pictures.map(function(s, i){
            return React.createElement(SimilarPicture, {picture: s, key: i, pictures: (self.state.pictures.slice(i+1)).concat([self.state.pictureData]), 
                                                is_auth: !(self.props.userAuth === undefined), 
                                                is_auth_board: false, 
                                                handlerAttach: self.setSavingPicture, 
                                                board_id: undefined, 
                                                updatePicture: self.updatePicture, 
                                                auth_username: self.props.userAuth.username})

        });

        return (
            React.createElement("div", {className: "container-fluid"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-12 text-center"}, 
                        React.createElement("div", {className: "block-inline"}, 
                            React.createElement("div", {className: "block-inline"}, 
                                React.createElement("img", {className: "block-picture", src: this.state.pictureData.url, alt: ""})
                            ), 
                            React.createElement("div", {className: "block-information"}, 
                                React.createElement("div", {className: "align-middle block-information-cell text-left"}, 
                                    React.createElement("a", {href: userUrl}, 
                                        React.createElement("div", {className: "image_circle_min block-inline align-middle", style: divStyleBackground}
                                        ), 
                                        React.createElement("div", {className: "block-inline align-middle name-user"}, 
                                            this.state.pictureData.user
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "align-middle block-information-cell text-right"}, 
                                    React.createElement(Button, {color: "danger", onClick: this.clickSave}, "SAVE")
                                )
                            )
                        ), 
                        React.createElement("div", null, 
                            React.createElement(AttachPicture, {picture: this.state.savingPicture, 
                                            user_auth: this.props.userAuth, 
                                            isOpen: this.state.isOpenAttach})
                        )
                    )
                ), 


                React.createElement(Masonry, {brakePoints: this.state.brakePoints}, 
                    listPictures
                )
            )
        )
    }
});


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


ReactDOM.render(
    React.createElement(Picture, {
        userAuth: getUserAuth(),
    }),
    document.getElementById('picture')
);
},{"../pictures/modules/attach_picture.jsx":2,"../pictures/modules/masonry.jsx":3,"../pictures/modules/picture.jsx":4}],2:[function(require,module,exports){
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
        return  React.createElement("div", null, 
                    React.createElement("img", {src: this.props.board.cover, width: "80", alt: ""}), 
                    this.props.board.name, 
                    React.createElement("span", null, React.createElement("button", {"data-dismiss": "modal", "aria-label": true, onClick: this.save}, "SAVE"))
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

},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}]},{},[1]);
