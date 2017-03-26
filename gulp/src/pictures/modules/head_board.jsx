var EditBoard = require('./../../boards/modules/edit_board.jsx')
var Button = Reactstrap.Button

var UnsubBoard = React.createClass({
    subscribe: function(board){
        $.ajax({
            url: "/board/api/board-subscribe/",
            dataType: 'json',
            data: {identification: this.props.boardIdentification},
            async: false,
            method: "POST"
        });

        this.props.update()
    },

    render: function(){
        return(
            <div className='board-block text-center'>
                <div>
                    <Button onClick={this.subscribe} size="sm">SUBSCRIBE</Button>
                </div>
            </div>
        )
    }
});

var SubBoard = React.createClass({
    unsubscribe: function(){
        $.ajax({
            url: "/board/api/board-unsubscribe/",
            dataType: 'json',
            data: {identification: this.props.boardIdentification},
            async: false,
            method: "POST"
        });

        this.props.update()
    },

    render: function(){
        return(
            <div className='board-block text-center'>
                <div>
                    <Button onClick={this.unsubscribe} size="sm" color="danger">SUBSCRIBE</Button> 
                </div>
            </div>
        )
    }
});

var MyBoard = React.createClass({
    render: function(){
        return(
            <div className='board-block text-center'>
                <div>
                    <Button onClick={this.props.clickHandler} size="sm">CHANGE</Button> 
                </div>
            </div>
        )
    }
});

var BoardHead = React.createClass({
    getInitialState: function(){
        var isAuth = this.props.userAuth.username !== undefined
        return {
            isAuth: isAuth,
            boardInformation: this.props.boardInformation,
            isModalOpenChange: false,
        }
    },

    update: function(){
        var boardInformation = this.props.boardInformationUpdate()
        alert('HERE')
        console.log
        this.setState({
            boardInformation: boardInformation,
        })
    },

    clickChangeHandler: function(){
        this.setState({
            isModalOpenChange: true,
        })
    },

    render: function(){
        var url = "/user/" + this.props.boardInformation.username + "/boards/"
        var actionButton = <div></div>

        if(this.state.isAuth){
            if(this.state.boardInformation.is_editing){
                actionButton = <MyBoard clickHandler={this.clickChangeHandler}/>
            }
            else{
                if(this.state.boardInformation.is_subscription){
                    actionButton = <SubBoard update={this.update} boardIdentification={this.state.boardInformation.identification}/>
                }
                else{
                    actionButton = <UnsubBoard update={this.update} boardIdentification={this.state.boardInformation.identification}/>
                }
            }
        }

        return(
            <div className='container-fluid'>
                <EditBoard board = {this.state.boardInformation}
                           updateBoard = {this.update}
                           isModalOpenChange = {this.state.isModalOpenChange}/>

                <div className="row">
                    <div className="col-2">
                        <a href={url} className="">
                            <i className="fa fa-angle-left" aria-hidden="true"></i> 
                            <span className='user_name'>
                                {this.props.boardInformation.username}
                            </span>
                        </a>
                    </div>
                    <div className="col-8 text-center">
                        <h2>
                            {this.state.boardInformation.name}
                        </h2>

                        <div>
                            <span className='block-information'>
                                Pictures:  <span>{this.state.boardInformation.count_pictures}</span>
                            </span>
                            <span className='block-information'>
                                Follower: <span>{this.props.boardInformation.count_follower}</span>
                            </span>
                        </div>
                        <div>
                            {actionButton}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = BoardHead