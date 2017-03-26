var Modal = Reactstrap.Modal
var ModalHeader = Reactstrap.ModalHeader
var ModalBody = Reactstrap.ModalBody 
var ModalFooter = Reactstrap.ModalFooter
var Button = Reactstrap.Button


var AddNewBoard = React.createClass({
    getInitialState: function() {
        return { 
            boardName: '', 
            isSecret: false,
            modal: false 
        }
    },
    
    createBoard: function(){
        var url =  '/board/api/board-add/'
        var data = { name: this.state.boardName, secret: this.state.isSecret }

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
        this.setState({boardName: '', isSecret: false})
        this.toggle();
        this.props.update();
    },

    nameChange: function(event){
        this.setState({boardName: event.target.value});
    },

    secretChange: function(){
        this.setState({ isSecret: !this.state.isSecret });
    },

    toggle: function(){
        this.setState({
            modal: !this.state.modal,
        })
    },

    render: function(){
        return(
            <div className='board-block'>
                <div className='text-center' onClick={this.toggle}>
                    <div><h6>ADD NEW</h6></div>
                    <img src='/media/board/add-new.jpg' className="img-fluid"/>
                </div>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-attach-picture">
                    <ModalHeader toggle={this.toggle}>CREATE BOARD</ModalHeader>
                        <ModalBody>
                            <div className='container-fluid'>
                                <div className="row">
                                    
                                    <div className="col-12">
                                        <div>                   
                                            <label className="required" htmlFor="id-name">Name:</label>
                                            <input id="id-name" maxLength="30" type="text" value={this.state.boardName} onChange={this.nameChange} required=""/>                   
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div>                   
                                            <label className="required" htmlFor="id-secter">Secret:</label>
                                            <input id="id-secter" type="checkbox" name="vehicle" value={this.state.isSecret}  onChange={this.secretChange} maxLength="30"/>               
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        <Button color="secondary" onClick={this.createBoard}>Create</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
});


module.exports = AddNewBoard