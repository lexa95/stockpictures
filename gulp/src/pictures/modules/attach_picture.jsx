var Modal = Reactstrap.Modal
var ModalHeader = Reactstrap.ModalHeader
var ModalBody = Reactstrap.ModalBody
var ModalFooter = Reactstrap.ModalFooter
var Button = Reactstrap.Button


var SaveBoard = React.createClass({
    getInitialState: function(){
        return({})
    },

    save: function(){
        this.props.save(this.props.board)
    },

    render: function(){
        var images = this.props.board.images
        while(images.length < 1){
            images.push({url: "/media/none.jpg"})
        }

        var style = {
            backgroundImage: "url('" + this.props.board.images[0].url + "')"
        };

        return  <div className="add-board-item">
                    <div className="board-cover-sm">
                        <div className='board-container-first-sm cover-img' style={style}>
                        </div>
                    </div>
                    <span className="add-board-name">{this.props.board.name}</span>
                    <Button onClick={this.save} size="sm" color="danger">SAVE</Button>
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

        return {
            picture: this.props.picture,
            board: board,
            modal: this.props.isOpen,
        };
    },

    toggle: function(){
        this.setState({
            modal: !this.state.modal
        })
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            picture: nextProps.picture,
            modal: nextProps.isOpen,
        });
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

        this.setState({
            modal: false,
        });
    },

    render: function(){
        self = this
        var list_board = this.state.board.map(function(s, i){
            return <SaveBoard board={s} key={i} save={self.save}/>
        })

        return <div>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-attach-picture" size='lg'>
                        <ModalHeader toggle={this.toggle}>SAVE BOARD</ModalHeader>
                            <ModalBody>
                                <div className='container-fluid'>
                                    <div className="row">
                                        <div className='col-7 vcenter'>
                                            <div>
                                                <img src={this.props.picture.url} alt="" className="img-fluid" />
                                            </div>
                                        </div>
                                        <div className='col-5 vcenter'>
                                            {list_board}
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
    }
});


module.exports = SaveBoards
