var Picture = require('../modules/picture.jsx')
var AddPicture = require('../modules/add_picture.jsx')
var AttachPicture = require('../modules/attach_picture.jsx')


var Pictures = React.createClass({

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
            isOpenAttach: false
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

                    <div className="masonry">
                        {addPicture}
                        {listPictures}
                    </div>
               </div>
    }
});

module.exports = Pictures