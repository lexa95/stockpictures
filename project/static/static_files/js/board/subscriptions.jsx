var BoardsUser = React.createClass({
    getSubscriptions:function(){
        var subscriptions

        if(this.props.isAuth){
            $.ajax({
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
                                                        isAuth={self.props.isEdit}
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
                                     isAuth: getAuthUsername() !== undefined}), 
    document.getElementById('boards')
);