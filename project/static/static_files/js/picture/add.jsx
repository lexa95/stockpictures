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
                    <span>
                        <button data-dismiss="modal" aria-label onClick={this.save}>SAVE</button>
                    </span>
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
        return {    picture: this.props.picture,
                    board: board,
                    name_picture: ''}
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({ picture: nextProps.picture,
                        name_picture: ''});
    },

    changeNamePicture: function(event){
        this.setState({name_picture: event.target.value})
        console.log(this.state.name_picture)
    },

    save: function(board){
        var data = {
            board_identification: board.identification,
            url_picture: this.props.picture,
            url_resource: this.props.resource_url,
            picture_name: this.state.name_picture
        }

        console.log(data)

        $.ajax({
            method: "POST",
            url: '/picture/api/picture-add/',
            dataType: 'json',
            data: data,
            async:false,
        })

    },


    render: function(){
        self = this
        var list_board = this.state.board.map(function(s, i){
            return <SaveBoard board={s} key={i} save={self.save}/>
        })
        
        return  <div>                
                    <div className="modal fade" id="save-image" taIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 className="modal-title" id="myModalLabel">SAVE PICTURE</h4>
                                </div>
                                <div>
                                    <div className="container-fluid modal-body vcenter">
                                        <div className="row">
                                            <div className='col-xs-7 vcenter text-center'>
                                                NAME: <input type="text" className="" onChange={this.changeNamePicture}/>
                                                <div>
                                                    <img src={this.props.picture} alt="" className="img-responsive" />
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
           
        return  <div className={this.state.class}>
                    <img src={url_picture} alt="" className="img-responsive" />
                    <button className='btn-edit' data-toggle="modal" data-target="#save-image" onClick={this.clickSave}>SAVE</button>
                </div>
    }
})

var AddPicture = React.createClass({
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
                saving_picture_url: ''}
    },

    changeResurceUrl: function(event){
        this.setState({resource_url: event.target.value})

    },

    updateSavingPicturesUrl: function(url){
        this.setState({saving_picture_url: url})
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
            return <Picture key={i} picture={s} resource_url={self.state.resource_url} update={self.updateSavingPicturesUrl}/>
        })

        return  <div className="container-fluid">

                    <SaveBoards picture={   this.state.saving_picture_url} 
                                            user_auth   =   {this.state.user_auth} 
                                            resource_url=   {this.state.resource_url}/>

                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <input type="text" onChange={this.changeResurceUrl}/>
                            <button onClick={this.clickNext}>next</button>
                        </div>
                        {listPicture}
                    </div>

                </div>
    }
});

ReactDOM.render(
    React.createElement(AddPicture, {}), 
    document.getElementById('pictures')
);