function isIncluded(board, list_board){
    for(var i=0; i < list_board.length; i++){
        if(board.identification === list_board[i].identification){
            return true;
        }
    }
    return false;
}

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

var EmptyBoard = React.createClass({
    render: function(){
        return  <div className='text-center'>
                    <h4>
                        <a href={this.props.url}>{this.props.board.name}</a>
                    </h4>
                    <a href={this.props.url}>
                        <img src={this.props.board.cover} className="img-responsive"/>
                    </a>
                </div>
    }
})

var UnsubBoard = React.createClass({
    subscribe: function(board){
        $.ajax({
            url: "/board/api/board-subscribe/",
            dataType: 'json',
            data: {identification: this.props.board.identification},
            async:false,
            method: "POST"
        });

        this.props.updateSubBoards()
    },

    render: function(){
        return  <div className='text-center'>
                    <h4>
                        <a href={this.props.url}>{this.props.board.name}</a>
                    </h4>
                    <a href={this.props.url}>
                        <img src={this.props.board.cover} className="img-responsive"/>
                    </a>
                    <button onClick={this.subscribe} className='btn-unsubscriptions'
                    >SUBSCRIBE</button>
                </div>
    }
});

var SubBoard = React.createClass({
    unsubscribe: function(){
        $.ajax({
            url: "/board/api/board-unsubscribe/",
            dataType: 'json',
            data: {identification: this.props.board.identification},
            async: false,
            method: "POST"
        });

        this.props.updateSubBoards()
    },

    render: function(){
        return  <div className='text-center'>
                    <h4 className='text-center'>
                        <a href={this.props.url}>{this.props.board.name}</a>
                    </h4>
                    <a href={this.props.url}>
                        <img src={this.props.board.cover} className="img-responsive"/>
                    </a>
                    <button onClick={this.unsubscribe} className='btn-subscriptions'>SUBSCRIBE</button>
                </div>
    }
});

var MyBoard = React.createClass({

    clickChange: function(){
        this.props.updateChangeBoard(this.props.board)
    },

    render: function(){
        return  <div className='text-center'>
                    <h4>
                        <a href={this.props.url}>{this.props.board.name}</a>
                    </h4>
                    <a href={this.props.url}>
                        <img src={this.props.board.cover} className="img-responsive"/>
                    </a>
                    <button onClick={this.clickChange} className='btn-edit' data-toggle="modal" data-target="#edit-board">CHANGE</button>
                </div>
    }
});

var Board = React.createClass({
    getInitialState: function(){
        console.log(this.props.board.identification)
        return {url: '/board/' + this.props.board.identification}
    },

    render: function(){
        var board
        if(!this.props.is_auth){
            board = <EmptyBoard board={this.props.board}/>
        }
        else if (this.props.user_auth === this.props.board.username){
            board = <MyBoard board={this.props.board} updateChangeBoard={this.props.updateChangeBoard} url={this.state.url}/>
        }
        else if(isIncluded(this.props.board, this.props.sub_board)){
            board = <SubBoard board={this.props.board} updateSubBoards ={this.props.updateSubBoards} url={this.state.url}/>
        }
        else{
            board = <UnsubBoard board={this.props.board} updateSubBoards={this.props.updateSubBoards} url={this.state.url}/>
        }

        return  <div className='col-xs-6 col-sm-3 col-md-3'>
                    {board}
                </div>
    }
});

var AddNewBoard = React.createClass({
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
        this.setState({board_name: '', isSecret: false})
        this.props.update();
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
                <div className='col-xs-6 col-sm-3 col-md-3 text-center' data-toggle="modal" data-target="#add-new">
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
                                        <input id="id_name" maxLength="30" type="text" value={this.state.board_name} onChange={this.nameChange} required=""/>                   
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

var Boards = React.createClass({
    getUserAuth: function(){
        var username;

        $.ajax({
            url: '/user/api/user_profile_auth/',
            dataType: 'json',
            success: function(data){
                username = data.username
            },
            async:false,
        });

        return username
    },

    getUserPage: function(){
        var url = window.location.pathname
        var username = url.split('/')[2]
        return username
    },

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
        var boards, user_auth, user_page, sub_boards, is_auth

        user_auth = this.getUserAuth()
        user_page = this.getUserPage()

        is_auth = user_auth !== undefined

        if(window.location.pathname.split('/')[3] === "subscriptions"){
            boards = this.getBoards(user_page, '/board/api/board-user-subscription/')
        }
        else{
            boards = this.getBoards(user_page, '/board/api/board-user/')
        }

        if(is_auth){
            sub_boards = this.getBoards(user_auth, '/board/api/board-user-subscription/')
        }
        else{
            sub_boards = []
        }
        return {user_auth: user_auth, 
                user_page: user_page, 
                is_auth: is_auth,
                boards: boards, 
                sub_boards: sub_boards,
                changingBoard: {name: '', secret: false}}
    },
    updateBoard: function(){
        if(window.location.pathname.split('/')[3] === "subscriptions"){
            this.setState({boards: this.getBoards(this.state.user_page, '/board/api/board-user-subscription/')})    
        }
        else{
            this.setState({boards: this.getBoards(this.state.user_page, '/board/api/board-user/')})
        }
        // this.setState({boards: this.getBoards(this.state.user_page, '/board/api/board-user/')})
    },
    updateSubBoards: function(){
        if(this.state.is_auth){
            this.setState({sub_boards: this.getBoards(this.state.user_auth, '/board/api/board-user-subscription/')})
        }
        else{
            sub_boards = []
        }
    },
    updateChangeBoard: function(b){
        this.setState({changingBoard: b})
    },
    render: function(){
        var addNewBoard
        if(this.state.user_auth === this.state.user_page &&
            window.location.pathname.split('/')[3] !== "subscriptions"){
            addNewBoard =   <div>
                                <AddNewBoard update = {this.updateBoard}/>
                                
                                <EditBoard  board          = {this.state.changingBoard}
                                            updateBoard    = {this.updateBoard}/>
                            </div>
        }
        else{
            addNewBoard = <div></div>
        }
        var self = this
        var boardList = this.state.boards.map(function(s, i){
            return <Board board={s} key={i} user_auth           = {self.state.user_auth}
                                            is_auth             = {self.state.is_auth}
                                            sub_board           = {self.state.sub_boards}
                                            updateBoard         = {self.updateBoard}
                                            updateChangeBoard   = {self.updateChangeBoard}
                                            updateSubBoards     = {self.updateSubBoards}/>
        })

        return  <div className='container-fluid'>
                    <div className="row">
                        <EditBoard  board = {this.state.changingBoard} updateBoard = {this.updateBoard}/>
                        {addNewBoard}
                        {boardList}
                    </div>
                </div>
    }
});

ReactDOM.render(
    React.createElement(Boards, {}), 
    document.getElementById('boards')
);