var AddNewBoard = require('./modules/add_new_boards.jsx')
var Board = require('./modules/board.jsx')
var EditBoard = require('./modules/edit_board.jsx')

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
        var boards, userAuth, userPage, subBoards, isAuth

        userAuth = this.getUserAuth()
        userPage = this.getUserPage()

        isAuth = userAuth !== undefined

        if(window.location.pathname.split('/')[3] === "subscriptions"){
            boards = this.getBoards(userPage, '/board/api/board-user-subscription/')
        }
        else{
            boards = this.getBoards(userPage, '/board/api/board-user/')
        }

        if(isAuth){
            subBoards = this.getBoards(userAuth, '/board/api/board-user-subscription/')
        }
        else{
            subBoards = []
        }
        return {
            userAuth: userAuth,
            userPage: userPage,
            isAuth: isAuth,
            boards: boards,
            subBoards: subBoards,
            changingBoard: {name: '', secret: false},
            isModalOpenChange: false,
        }
    },
    updateBoard: function(){
        if(window.location.pathname.split('/')[3] === "subscriptions"){
            this.setState({boards: this.getBoards(this.state.userPage, '/board/api/board-user-subscription/')})
        }
        else{
            this.setState({boards: this.getBoards(this.state.userPage, '/board/api/board-user/')})
        }
    },
    updateSubBoards: function(){
        if(this.state.isAuth){
            this.setState({subBoards: this.getBoards(this.state.userAuth, '/board/api/board-user-subscription/')})
        }
        else{
            subBoards = []
        }
    },
    updateChangeBoard: function(b){
        this.setState({
            changingBoard: b,
            isModalOpenChange: true,
        })

    },
    render: function(){
        var addNewBoard
        if(this.state.userAuth === this.state.userPage &&
            window.location.pathname.split('/')[3] !== "subscriptions"){
            addNewBoard =   <div className="board-block">
                                <AddNewBoard update = {this.updateBoard}/>

                                <EditBoard  board               = {this.state.changingBoard}
                                            updateBoard         = {this.updateBoard}
                                            isModalOpenChange   = {this.state.isModalOpenChange}/>
                            </div>
        }
        else{
            addNewBoard = <div></div>
        }
        var self = this
        var boardList = this.state.boards.map(function(s, i){
            return <Board board={s} key={i} userAuth           = {self.state.userAuth}
                                            isAuth             = {self.state.isAuth}
                                            subBoard           = {self.state.subBoards}
                                            updateBoard         = {self.updateBoard}
                                            updateChangeBoard   = {self.updateChangeBoard}
                                            updateSubBoards     = {self.updateSubBoards}/>
        })

        return  <div className='container'>
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
