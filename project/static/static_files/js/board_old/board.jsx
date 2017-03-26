var SaveBoard = React.createClass({
    getInitialState: function(){
        return({})
    },

    save: function(){
        this.props.save(this.props.board)
    },

    render: function(){
        return  <div>
                    <img src={this.props.board.cover} width='80' alt=""/>
                    {this.props.board.name}
                    <span><button data-dismiss="modal" aria-label onClick={this.save}>SAVE</button></span>
                </div>
    }
});

var SaveBoards = React.createClass({
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
        console.log(board)
        return {    picture: this.props.picture,
                    board: board }
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({picture: nextProps.picture});
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

    },


    render: function(){
        self = this
        var list_board = this.state.board.map(function(s, i){
            return <SaveBoard board={s} key={i} save={self.save}/>
        })
        
        return  <div>                
                    <div className="modal fade" id="save-board" taIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 className="modal-title" id="myModalLabel">SAVE BOARD</h4>
                                </div>
                                <div>
                                    <div className="container-fluid modal-body vcenter">
                                        <div className="row">
                                            <div className='col-xs-7 vcenter'>
                                                <div>
                                                    <img src={this.props.picture.url} alt="" className="img-responsive" />
                                                </div>
                                            </div>
                                            <div className='col-xs-5 vcenter'>
                                                {list_board}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
});

var Picture = React.createClass({

    remove: function(){
        console.log(this.props.picture)
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

    add: function(){
        this.props.setSavingPicture(this.props.picture)
    },

    render: function(){
        var actions;

        if(!this.props.is_auth){
            actions = <span></span>
        }
        if(this.props.is_auth_board){
            actions = <button className='btn-edit' onClick={this.remove}>REMOVE</button>
        }
        else{
            actions = <button className='btn-edit' onClick={this.add} data-toggle="modal" data-target="#save-board">SAVE</button>
        }

        return (
                <div className='col-xs-3 text-center'>
                    <a href={this.props.picture.resource_url} target="_blank">
                        <img src={this.props.picture.url} alt="" className="img-responsive" />
                    </a>
                    {actions}
                </div>
    )}
});

var AddPicture = React.createClass({
    getInitialState: function(){
        return{
            resource_url: '',
            arr_pictres: []
        }
    },

    urlChange: function(event){
        this.setState({resource_url: event.target.value});
    },

    render: function(){
        return  <div>
                    <a href='/picture/add/'>
                        <div className='col-xs-3 text-center' data-toggle="modal" data-target="#add-picture">
                            <div><h4>ADD NEW</h4></div>
                            <img src='/media/board/add-new.jpg' className="img-responsive"/>
                        </div>                  
                    </a>  
                </div>
    }
});

var Pictures = React.createClass({
    getPictures: function(identification){
        var pictures

        $.ajax({
            url: '/picture/api/picutes-in-board/',
            dataType: 'json',
            data: {'identification': identification},
            success: function(data){
                pictures = data
            },
            async:false,
        })
        return pictures
    },

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

    getUserBoard: function(identification){
        var username
        
        $.ajax({
            url: '/board/api/board-information/',
            data: {'identification': identification},
            dataType: 'json',
            success: function(data){
                username = data.username
            },
            async:false,
        });
        return username
    },

    getInitialState: function(){
        var pictures = this.getPictures(this.props.board_identification)
        var user_auth = this.getUserAuth()
        var user_board = this.getUserBoard(this.props.board_identification);

        var is_auth = user_auth.username !== undefined
        var is_auth_board = user_board === user_auth.username

        console.log(is_auth_board)

        var data = {
            'identification': this.props.board_identification
        }

        return { pictures: pictures,
                 is_auth: is_auth,
                 is_auth_board: is_auth_board,
                 saving_picture: {},
                 user_auth: user_auth,
                }
    },

    setSavingPicture: function(picture){
        this.setState({saving_picture: picture})
    },

    updatePicture: function(){
        this.setState({pictures: this.getPictures(this.props.board_identification)});
    },

    render: function(){

        // console.log(this.is_auth_board)
        if(this.state.is_auth_board){
            var addPicture = <AddPicture/>
        }
        else{
            var addPicture = <span></span>
        }

        self = this
        var listPictures = this.state.pictures.map(function(s, i){
            return <Picture picture={s} key={i} is_auth={self.state.is_auth} 
                                                is_auth_board={self.state.is_auth_board}
                                                setSavingPicture={self.setSavingPicture}
                                                board_id={self.props.board_identification}
                                                updatePicture={self.updatePicture}/>

        });
        return (<div>
                    {addPicture}
                    <SaveBoards picture     ={this.state.saving_picture}
                                user_auth   ={this.state.user_auth}/>
                    <div className="container-fluid">
                        <div className="row">
                        {listPictures}
                        </div>
                    </div>
                </div>
    )}
});

var url = window.location.pathname
var board_identification = url.split('/')[2]


ReactDOM.render(
    React.createElement(Pictures, {board_identification: board_identification}), 
    document.getElementById('pictures')
);