var Picture = require('../pictures/modules/picture.jsx')
var AddPicture = require('../pictures/modules/add_picture.jsx')
var AttachPicture = require('../pictures/modules/attach_picture.jsx')
var Masonry = require('../pictures/modules/masonry.jsx')


var Pictures = React.createClass({
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

    getPictures: function(){
        var array

        $.ajax({
            url: '/picture/api/last-pictures/',
            dataType: 'json',
            success: function(data){
                array = data
            },
            async:false,
        });
        return array
    },

    getInitialState: function(){
        var pictures = this.getPictures()
        var userAuth = this.getUserAuth()
        var isAuth = userAuth.username !== undefined
        var isAuthBoard = this.props.isAuthBoard

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
        var pictures = this.getPictures()
        this.setState({pictures: pictures});
    },

    render: function(){

        if(this.state.isAuthBoard){
            var addPicture = <AddPicture/>
        }
        else{
            var addPicture = <span></span>
        }

        self = this
        var listPictures = this.state.pictures.map(function(s, i){
            return <Picture picture={s} key={i} pictures={self.state.pictures.slice(i+1)}
                                                is_auth={self.state.isAuth}
                                                is_auth_board={self.state.isAuthBoard}
                                                handlerAttach={self.setSavingPicture}
                                                board_id={self.props.identification}
                                                updatePicture={self.updatePicture}
                                                auth_username={self.state.userAuth.username}/>

        });
        return  <div>
                    <AttachPicture  picture     ={this.state.savingPicture}
                                    user_auth   ={this.state.userAuth}
                                    isOpen      ={this.state.isOpenAttach}/>

                    <Masonry brakePoints={this.state.brakePoints}>
                        {listPictures}
                    </Masonry>
               </div>
    }
});

ReactDOM.render(
    React.createElement(Pictures, {
        isAuthBoard: false,
    }),
    document.getElementById('pictures')
);
