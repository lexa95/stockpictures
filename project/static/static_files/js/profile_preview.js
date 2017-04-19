(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var UserInformations = React.createClass({displayName: "UserInformations",
    getInitialState: function() {

        var profile;
        var data = {
            'username': this.props.username
        };
        var url = '/user/api/user-profile/';

        $.ajax({
            url: url,
            dataType: 'json',
            data: data,
            success: function(data){
                profile = data;
            },
            async:false,
        });
        return {profile: profile};
    },
    
    render: function() {
        var divStyleBackground = {
            backgroundImage: 'url(' + this.state.profile.photo + ')'
        }

        return (
            React.createElement("div", {className: "container-fluid"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-sm-12"}, 
                        React.createElement("div", {className: "text-center align-middle"}, 
                            React.createElement("div", {className: "name_block block-inline align-middle"}, 
                                React.createElement("h2", null, this.state.profile.first_name, " ", this.state.profile.last_name)
                            ), 
                            React.createElement("div", {className: "image_profile_circle block-inline align-middle", style: divStyleBackground})
                        )
                    )
                )
            )
        );
    }
});

var url = window.location.pathname
var username = url.split('/')[2]

ReactDOM.render(
    React.createElement(UserInformations, {username: username}), document.getElementById('user-information')
);

},{}]},{},[1]);
