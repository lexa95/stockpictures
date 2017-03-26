var Button          = Reactstrap.Button
var AttachPicture   = require('../pictures/modules/attach_picture.jsx')
var SimilarPicture  = require('../pictures/modules/picture.jsx')

var Picture = React.createClass({
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
            return <SimilarPicture picture={s} key={i} pictures={(self.state.pictures.slice(i+1)).concat([self.state.pictureData])}
                                                is_auth={!(self.props.userAuth === undefined)} 
                                                is_auth_board={false}
                                                handlerAttach={self.setSavingPicture}
                                                board_id={undefined}
                                                updatePicture={self.updatePicture}
                                                auth_username={self.props.userAuth.username}/>

        });

        return (
            <div className='container-fluid'>
                <div className='row'>
                    <div className="col-12 text-center">
                        <div className='block-inline'>
                            <div className='block-inline'>
                                <img className='block-picture' src={this.state.pictureData.url} alt=""/>
                            </div>
                            <div className='block-information'>
                                <div className='align-middle block-information-cell text-left'>
                                    <a href={userUrl}>
                                        <div className='image_circle_min block-inline align-middle' style={divStyleBackground}>
                                        </div>
                                        <div className='block-inline align-middle name-user'>
                                            {this.state.pictureData.user}
                                        </div>
                                    </a>
                                </div>
                                <div className='align-middle block-information-cell text-right'>
                                    <Button color="danger" onClick={this.clickSave}>SAVE</Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <AttachPicture  picture     =   {this.state.savingPicture}
                                            user_auth   =   {this.props.userAuth}
                                            isOpen      =   {this.state.isOpenAttach}/>
                        </div>
                    </div>
                </div>
                

                <div className='masonry'>
                    {listPictures}
                </div>
            </div>
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