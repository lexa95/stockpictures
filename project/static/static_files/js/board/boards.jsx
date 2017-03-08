var Board = React.createClass({
    render: function(){
        return (
            <a href="#">
                <div className='col-xs-3 text-center'>
                    <div><h4>{this.props.board.name}</h4></div>
                    <img src={this.props.board.cover} className="img-responsive"/>
                </div>
            </a>
        );
    }
});

var AddNew = React.createClass({
    getInitialState: function() {
        
        return {board_name: '',
                isSecret: false
            };
    },
    
    addBoard: function(){
        var url =  '/board/api/board-add/'
        var data = {
            name: this.state.board_name,
            secret: this.state.isSecret,
        }

        $.ajax({
            url: url,
            dataType: 'json',
            method: 'POST',
            data: data,
            success: function(){
                console.log('!  !  !')
            },
            error: function(error){
                alert(error.responseJSON.status)
            },
            async:false,
        });
        
    },

    nameChange: function(event){
        this.setState({board_name: event.target.value});
    },

    secretChange: function(){
        this.setState({
            isSecret: !this.state.isSecret
        });
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
                                <button type="button" className="btn btn-primary" onClick={this.addBoard}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
});

var BoardsUser = React.createClass({
    getInitialState: function() {

        var boards
        var data = {
            'username': this.props.username
        }
        var url = '/board/api/board-user/'

        $.ajax({
            url: url,
            dataType: 'json',
            data: data,
            success: function(data){
                boards = data
            },
            async:false,
        })
        console.log(boards)
        return {boards: boards}
    },
    
    render: function() {
        var boardList = this.state.boards.map(function(s, i){
            return <Board board={s} key={i} index={i}/>
        });

        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <AddNew/>
                        {boardList}
                    </div>
                </div>
            </div>
        );
    }
});

var url = window.location.pathname
var username = url.split('/')[2]

ReactDOM.render(
    React.createElement(BoardsUser, {username: username}), document.getElementById('boards')
);