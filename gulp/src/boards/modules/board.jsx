var Button = Reactstrap.Button

function isIncluded(board, listBoard){
    for(var i=0; i < listBoard.length; i++){
        if(board.identification === listBoard[i].identification){
            return true;
        }
    }
    return false;
}

var EmptyBoard = React.createClass({
    render: function(){
        return  <div className='board-block text-center'>
                    <h6>
                        <a href={this.props.url}>{this.props.board.name}</a>
                    </h6>
                    <a href={this.props.url}>
                        <img src={this.props.board.cover} className="img-fluid"/>
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
            async: false,
            method: "POST"
        });

        this.props.updateSubBoards()
    },

    render: function(){
        return  <div className='board-block text-center'>
                    <h6>
                        <a href={this.props.url}>{this.props.board.name}</a>
                    </h6>
                    <a href={this.props.url}>
                        <img src={this.props.board.cover} className="img-fluid"/>
                    </a>
                    <div>
                        <Button onClick={this.subscribe} size="sm">SUBSCRIBE</Button>
                    </div>
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
        return  <div className='board-block text-center'>
                    <h6 className='text-center'>
                        <a href={this.props.url}>{this.props.board.name}</a>
                    </h6>
                    <a href={this.props.url}>
                        <img src={this.props.board.cover} className="img-fluid"/>
                    </a>
                    <div>
                        {/*<button onClick={this.unsubscribe} className='btn-subscriptions'>SUBSCRIBE</button>*/}
                        <Button onClick={this.unsubscribe} size="sm" color="danger">SUBSCRIBE</Button> 
                    </div>
                </div>
    }
});

var MyBoard = React.createClass({

    clickChange: function(){
        this.props.updateChangeBoard(this.props.board)
    },

    render: function(){
        return  <div className='board-block text-center'>
                    <h6>
                        <a href={this.props.url}>{this.props.board.name}</a>
                    </h6>
                    <a href={this.props.url}>
                        <img src={this.props.board.cover} className="img-fluid"/>
                    </a>
                    <div>
                        {/*<button onClick={this.clickChange} className='btn-edit' data-toggle="modal" data-target="#edit-board">CHANGE</button>*/}
                        <Button onClick={this.clickChange} size="sm">CHANGE</Button> 
                    </div>
                </div>
    }
});

var Board = React.createClass({
    getInitialState: function(){
        return {url: '/board/' + this.props.board.identification}
    },

    render: function(){
        var board
        if(!this.props.isAuth){
            board = <EmptyBoard board={this.props.board}/>
        }
        else if (this.props.userAuth === this.props.board.username){
            board = <MyBoard board={this.props.board} updateChangeBoard={this.props.updateChangeBoard} url={this.state.url}/>
        }
        else if(isIncluded(this.props.board, this.props.subBoard)){
            board = <SubBoard board={this.props.board} updateSubBoards ={this.props.updateSubBoards} url={this.state.url}/>
        }
        else{
            board = <UnsubBoard board={this.props.board} updateSubBoards={this.props.updateSubBoards} url={this.state.url}/>
        }
        
        return  <div className='col-12 col-sm-4 col-md-3 col-md-2'>
                    {board}
                </div>
    }
});


module.exports = Board