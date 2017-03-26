var UserInformations = React.createClass({
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
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="text-center align-middle">
                            <div className='name_block block-inline align-middle'>
                                <h2>{this.state.profile.first_name} {this.state.profile.last_name}</h2>
                            </div>
                            <div className='image_profile_circle block-inline align-middle' style={divStyleBackground}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var url = window.location.pathname
var username = url.split('/')[2]

ReactDOM.render(
    React.createElement(UserInformations, {username: username}), document.getElementById('user-information')
);