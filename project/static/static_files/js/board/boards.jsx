function isIncluded(board, list_board){
    for(var i=0; i < list_board.length; i++){
        console.log(board.identification);
        console.log(list_board[i].identification);
        console.log('- - - - - - - -- - - - - - -- - - - - - - -- ');
        if(board.identification === list_board[i].identification){
            return true;
        }
    }
    console.log()
    return false;
}

var Board = React.createClass({
    getInitialState: function(){
        console.log(this.props.subscriptions)
        return {urlBoard: '/board/' + this.props.username + '/' + this.props.board.identification}
    },
    
    edit: function(e){
        this.props.edit(this.props.board)
    },

    unsubscribe: function(e){
        this.props.unsubscribe(this.props.board)
    },

    subscribe: function(e){
        this.props.subscribe(this.props.board)
    },
    
    render: function(){
        if(!this.props.isAuth){
            var titleBoard = <span></span>
        }
        else{
            if(this.props.isEdit){
                var titleBoard = <span> /<button className='btn-edit' onClick={this.edit} data-toggle="modal" data-target="#edit-board">EDIT</button>\</span>
            }
            else{
                if(isIncluded(this.props.board, this.props.subscriptions)){
                    var titleBoard = <span><button className='btn-subscriptions' onClick={this.unsubscribe} data-toggle="modal" data-target="#edit-board">SUBSCRIBE</button></span>
                }
                else{
                    var titleBoard = <span>/<button className='btn-unsubscriptions' onClick={this.subscribe} data-toggle="modal" data-target="#edit-board">SUBSCRIBE</button></span>
                }
            }
        }
        return (
                <div className='col-xs-3 text-center block-board'>
                    <h4>
                        <a href={this.state.urlBoard}>{this.props.board.name}</a>
                        {titleBoard}
                    </h4>
                    <a href={this.state.urlBoard}>
                        <img src={this.props.board.cover} className="img-responsive"/>
                    </a>
                </div>
        )
    }
});

var EditBoard = React.createClass({
    getInitialState: function() {
        return { name: this.props.board.name, secret: this.props.board.secret }
    },

    nameChange: function(event){
        this.setState({name: event.target.value});
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
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({name: nextProps.board.name,
                       secret: nextProps.board.secret});
    },

    render: function(){
        return(
            <div>                
                <div className="modal fade" id="edit-board" taIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content add-new-board-dialog">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="myModalLabel">Edit board</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div>                   
                                        <label className="required" htmlFor="id_name_edit">Name:</label>
                                        <input id="id_name_edit" maxLength="30" type="text" value={this.state.name} required="" onChange={this.nameChange} />                   
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div>                   
                                        <label className="required" htmlFor="id_secter_edit">Secret:</label>
                                        <input id="id_secter_edit" type="checkbox" name="vehicle" checked={this.state.secret} onChange={this.secretChange} />               
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.deleteBoard}>Delete</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.editBoard}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var AddNew = React.createClass({
    getInitialState: function() {
        return { board_name: '', isSecret: false }
    },
    
    addBoard: function(){
        var url =  '/board/api/board-add/'
        var data = { name: this.state.board_name, secret: this.state.isSecret }

        $.ajax({
            url: url,
            dataType: 'json',
            method: 'POST',
            data: data,
            error: function(error){
                alert(error.responseJSON.status)
            },
            async:false,
        });
        this.props.updateBoard();
    },

    nameChange: function(event){
        this.setState({board_name: event.target.value});
    },

    secretChange: function(){
        this.setState({ isSecret: !this.state.isSecret });
    },

    render: function(){
        return(
            <div>
                <div className='col-xs-3 text-center' data-toggle="modal" data-target="#add-new">
                    <div><h4>ADD NEW</h4></div>
                    <img src='/media/board/add-new.jpg' className="img-responsive"/>
                </div>
                
                <div className="modal fade" id="add-new" taIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content add-new-board-dialog">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="myModalLabel">Add new board</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div>                   
                                        <label className="required" htmlFor="id_name">Name:</label>
                                        <input id="id_name" maxLength="30" type="text" value={this.props.board_name} onChange={this.nameChange} required=""/>                   
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div>                   
                                        <label className="required" htmlFor="id_secter">Secret:</label>
                                        <input id="id_secter" type="checkbox" name="vehicle" value={this.state.isSecret}  onChange={this.secretChange} maxLength="30"/>               
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.addBoard}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var BoardsUser = React.createClass({
    getBoard: function(){
        var boards
        
        $.ajax({
            url: '/board/api/board-user/',
            dataType: 'json',
            data: {'username': this.props.username},
            success: function(data){
                boards = data
            },
            async:false,
        })
        return boards
    },

    getSubscriptions:function(){
        var subscriptions

        if(this.props.isAuth){
            $.ajax({
                data: {username: this.props.authUsername},
                url: "/board/api/board-user-subscription/",
                dataType: 'json',
                success: function(data){
                    subscriptions = data
                },
                async:false,
            })
        }
        else{
            subscriptions = []
        }
        return subscriptions
    },

    getInitialState: function() {
        return {
            boards: this.getBoard(), 
            editingBoard: '',
            subscriptions: this.getSubscriptions(),
        }
    },

    updateBoard: function(){
        this.setState({boards: this.getBoard()})
    },

    setEditingBoard: function(board){
        var self = this
        this.setState({ editingBoard: board}, function() {
            self.forceUpdate()
        });
    },

    unsubscribe: function(board){
        $.ajax({
            url: "/board/api/board-unsubscribe/",
            dataType: 'json',
            data: {identification: board.identification},
            async: false,
            method: "POST"
        });

        this.setState({subscriptions: this.getSubscriptions()})
    },

    subscribe: function(board){
        $.ajax({
            url: "/board/api/board-subscribe/",
            dataType: 'json',
            data: {identification: board.identification},
            async:false,
            method: "POST"
        });

        this.setState({subscriptions: this.getSubscriptions()})
    },

    render: function() {
        var self = this
        var boardList = this.state.boards.map(function(s, i){
            return <Board board={s} key={i} index={i}   edit={self.setEditingBoard} 
                                                        username={self.props.username} 
                                                        isEdit={self.props.isEdit}
                                                        isAuth={self.props.isAuth}
                                                        subscriptions={self.state.subscriptions}
                                                        subscribe={self.subscribe}
                                                        unsubscribe={self.unsubscribe}/>
        });

        if (this.props.isEdit) {
            var addNewBoard = <div>
                    <EditBoard  board={this.state.editingBoard} 
                                    username={this.props.username}
                                    updateBoard={this.updateBoard}/>
                    <AddNew updateBoard={this.updateBoard}/></div>
        } else {
            var addNewBoard = <div></div>
        }

        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        {addNewBoard}
                        {boardList}
                    </div>
                </div>
            </div>
        );
    }
});

var url = window.location.pathname
var username = url.split('/')[2]

function getAuthUsername(){
    var username;

    $.ajax({
        url: '/profile/api/user_profile_auth/',
        dataType: 'json',
        success: function(data){
            username = data.username
        },
        error: function(data){
            
        },
        async:false,
    });

    return username
}

ReactDOM.render(
    React.createElement(BoardsUser, {username: username, 
                                     isEdit: username == getAuthUsername(),
                                     isAuth: getAuthUsername() !== undefined,
                                     authUsername: getAuthUsername()}
                                     ), 
    document.getElementById('boards')
);