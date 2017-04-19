(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Modal = Reactstrap.Modal
var ModalHeader = Reactstrap.ModalHeader
var ModalBody = Reactstrap.ModalBody
var ModalFooter = Reactstrap.ModalFooter
var Button = Reactstrap.Button
var Masonry  = require('../pictures/modules/masonry.jsx')

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
            namePicture: '',
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
        var data = {
            board_identification: board.identification,
            url_picture: this.props.picture,
            url_resource: this.props.resource_url,
            picture_name: this.state.namePicture
        }

        $.ajax({
            method: "POST",
            url: '/picture/api/picture-add/',
            dataType: 'json',
            data: data,
            async:false,
        })
        this.toggle()
    },

    changeNamePicture: function(event){
        this.setState({name_picture: event.target.value})
        console.log(this.state.name_picture)
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
                                            React.createElement("div", {className: "input-group"}, 
                                                React.createElement("span", {className: "input-group-addon input-title", id: "basic-addon1"}, "Name:"), 
                                                React.createElement("input", {type: "text", className: "form-control", value: this.state.name, onChange: this.changeNamePicture, required: ""})
                                            ), 
                                            React.createElement("div", {className: "text-center add-img-block"}, 
                                                React.createElement("img", {src: this.props.picture, alt: "", className: "img-fluid"})
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


var Picture = React.createClass({displayName: "Picture",
    getInitialState: function(){
        return  {
            class: 'col-xs-3 text-center',
        }
    },
    clickSave: function(){
        this.props.update(this.props.picture)
    },

    render: function(){
        if(this.props.picture[0] === '/'){
            console.log(this.props.resource_url.split('/'))
            var resource_url = this.props.resource_url.split('/')
            var url_picture =  resource_url[0] + '/' + resource_url[2] + this.props.picture
        }
        else{
            var url_picture = this.props.picture
        }

        return  React.createElement("div", {className: "column"}, 
                    React.createElement("div", null, 
                        React.createElement("div", null, 
                            React.createElement("a", {href: ""}, 
                                React.createElement("img", {src: url_picture, alt: "", className: "img-fluid"})
                            )
                        ), 
                        React.createElement("div", null, 
                            React.createElement(Button, {color: "secondary", size: "sm", onClick: this.clickSave, className: "btn-save"}, "SAVE")
                        )
                    )
                )
    }
})

var AddPicture = React.createClass({displayName: "AddPicture",
     getUserAuth: function(){
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
    },

    getInitialState: function(){
        return {resource_url: '',
                user_auth: this.getUserAuth(),
                pictures: [],
                saving_picture_url: '',
                isOpenAttach: false}
    },

    changeResurceUrl: function(event){
        this.setState({
            resource_url: event.target.value,
        })
    },

    updateSavingPicturesUrl: function(url){
        this.setState({
            saving_picture_url: url,
            isOpenAttach: true
        })
    },

    clickNext: function(){
        var url = '/picture/api/picture-parse/'
        var data = {'resource_url': this.state.resource_url}
        var self = this
        $.ajax({
            url: url,
            dataType: 'json',
            data: {'resource_url': this.state.resource_url},
            success: function(data){
                self.setState({pictures: data.src})
            },
            async:false,
        });
    },

    render: function(){
        var self = this
        var listPicture = this.state.pictures.map(function(s, i){
            return React.createElement(Picture, {key: i, picture: s, resource_url: self.state.resource_url, update: self.updateSavingPicturesUrl})
        })

        return  React.createElement("div", {className: "container-fluid"}, 

                    React.createElement(SaveBoards, {picture: this.state.saving_picture_url, 
                                 user_auth: this.state.user_auth, 
                                 resource_url: this.state.resource_url, 
                                 isOpen: this.state.isOpenAttach}), 

                    React.createElement("div", {className: "col-12 text-center search-line"}, 
                        React.createElement("div", {className: "block-inline"}, 
                            React.createElement("div", {className: "input-group"}, 
                                React.createElement("input", {onChange: this.changeResurceUrl, type: "text", className: "form-control"}), 
                                React.createElement("span", {className: "input-group-btn"}, 
                                    React.createElement("button", {onClick: this.clickNext, className: "btn btn-secondary", type: "button"}, "Go!")
                                )
                            )
                        )
                    ), 

                    React.createElement("div", null, 
                        React.createElement(Masonry, {brakePoints: this.props.brakePoints}, 
                            listPicture
                        )
                    )

                )
    }
});

let brakePoints = [350, 500, 750, 100];

ReactDOM.render(
    React.createElement(AddPicture, {brakePoints: brakePoints}),
    document.getElementById('pictures')
);
},{"../pictures/modules/masonry.jsx":2}],2:[function(require,module,exports){
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
},{}]},{},[1]);
