var Modal = Reactstrap.Modal
var ModalHeader = Reactstrap.ModalHeader
var ModalBody = Reactstrap.ModalBody
var ModalFooter = Reactstrap.ModalFooter
var Button = Reactstrap.Button


var EditBoard = React.createClass({
    getInitialState: function() {
        return {
            name: this.props.board.name,
            secret: this.props.board.secret,
            isModalOpenChange: this.props.isModalOpenChange,
            modal: false,
        }
    },

    nameChange: function(event){
        this.setState({
            name: event.target.value
        });
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
        this.toggle()
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
        this.toggle()
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            name: nextProps.board.name,
            secret: nextProps.board.secret,
            modal: nextProps.isModalOpenChange,
        });
    },

    toggle: function(){
        this.setState({
            modal: !this.state.modal,
        })
    },

    render: function(){
        return(
            <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-attach-picture">
                    <ModalHeader toggle={this.toggle}>CREATE BOARD</ModalHeader>
                        <ModalBody>
                            <div className='container-fluid'>
                                <div className="row">

                                    <div className="col-12">
                                        <div className="input-group">
                                            <span className="input-group-addon input-title" id="basic-addon1">Name:</span>
                                            <input type="text" className="form-control" value={this.state.name} onChange={this.nameChange} required=""/>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="input-group">
                                            <label className="required" htmlFor="id-secter">Secret:</label>
                                            <input id="id-secter" type="checkbox" name="vehicle" value={this.state.secret}  onChange={this.secretChange} className="input-check-box"/>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.deleteBoard}>Delete</Button>
                        <Button color="secondary" onClick={this.editBoard}>Save changes</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
});


module.exports = EditBoard
