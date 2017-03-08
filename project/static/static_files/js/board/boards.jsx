var Board = React.createClass({
    render: function(){
        return (
            <div className='col-xs-3 text-center'>
                <div><h4>{this.props.board.name}</h4></div>
                <img src={this.props.board.cover} class="img-responsive"/>
            </div>
        );
    }
});

var BoardsUser = React.createClass({
    getInitialState: function() {

        var boards;
        var data = {
            'username': this.props.username
        };
        var url = '/board/api/board-user/';

        $.ajax({
            url: url,
            dataType: 'json',
            data: data,
            success: function(data){
                boards = data;
            },
            async:false,
        });
        console.log(boards)
        return {boards: boards};
    },
    
    render: function() {
        var boardList = this.state.boards.map(function(s, i){
            return <Board board={s} key={i} index={i}/>;
        });

        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
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