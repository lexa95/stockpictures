var Modal = Reactstrap.Modal
var ModalHeader = Reactstrap.ModalHeader
var ModalBody = Reactstrap.ModalBody
var ModalFooter = Reactstrap.ModalFooter
var Button = Reactstrap.Button
var Masonry  = require('../pictures/modules/masonry.jsx')

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
            namePicture: '',
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
        var data = {
            board_identification: board.identification,
            url_picture: this.props.picture,
            url_resource: this.props.resource_url,
            picture_name: this.state.namePicture
        }

        $.ajax({
            method: "POST",
            url: '/picture/api/picture-add/',
            dataType: 'json',
            data: data,
            async:false,
        })
        this.toggle()
    },

    changeNamePicture: function(event){
        this.setState({name_picture: event.target.value})
        console.log(this.state.name_picture)
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
                                            <div className="input-group">
                                                <span className="input-group-addon input-title" id="basic-addon1">Name:</span>
                                                <input type="text" className="form-control" value={this.state.name} onChange={this.changeNamePicture} required=""/>
                                            </div>
                                            <div className="text-center add-img-block">
                                                <img src={this.props.picture} alt="" className="img-fluid" />
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


var Picture = React.createClass({
    getInitialState: function(){
        return  {
            class: 'col-xs-3 text-center',
        }
    },
    clickSave: function(){
        this.props.update(this.props.picture)
    },

    render: function(){
        if(this.props.picture[0] === '/'){
            console.log(this.props.resource_url.split('/'))
            var resource_url = this.props.resource_url.split('/')
            var url_picture =  resource_url[0] + '/' + resource_url[2] + this.props.picture
        }
        else{
            var url_picture = this.props.picture
        }

        return  <div className="column">
                    <div>
                        <div>
                            <a href="">
                                <img src={url_picture} alt="" className="img-fluid" />
                            </a>
                        </div>
                        <div>
                            <Button color="secondary" size="sm" onClick={this.clickSave} className="btn-save">SAVE</Button>
                        </div>
                    </div>
                </div>
    }
})

var AddPicture = React.createClass({
     getUserAuth: function(){
        var user;

        $.ajax({
            url: '/user/api/user_profile_auth/',
            dataType: 'json',
            success: function(data){
                user = data
            },
            async:false,
        });

        return user
    },

    getInitialState: function(){
        return {resource_url: '',
                user_auth: this.getUserAuth(),
                pictures: [],
                saving_picture_url: '',
                isOpenAttach: false}
    },

    changeResurceUrl: function(event){
        this.setState({
            resource_url: event.target.value,
        })
    },

    updateSavingPicturesUrl: function(url){
        this.setState({
            saving_picture_url: url,
            isOpenAttach: true
        })
    },

    clickNext: function(){
        var url = '/picture/api/picture-parse/'
        var data = {'resource_url': this.state.resource_url}
        var self = this
        $.ajax({
            url: url,
            dataType: 'json',
            data: {'resource_url': this.state.resource_url},
            success: function(data){
                self.setState({pictures: data.src})
            },
            async:false,
        });
    },

    render: function(){
        var self = this
        var listPicture = this.state.pictures.map(function(s, i){
            return <Picture key={i} picture={s} resource_url={self.state.resource_url} update={self.updateSavingPicturesUrl}/>
        })

        return  <div className="container-fluid">

                    <SaveBoards  picture = {this.state.saving_picture_url}
                                 user_auth = {this.state.user_auth}
                                 resource_url = {this.state.resource_url}
                                 isOpen = {this.state.isOpenAttach}/>

                    <div className="col-12 text-center search-line">
                        <div className="block-inline">
                            <div className="input-group">
                                <input onChange={this.changeResurceUrl} type="text" className="form-control"/>
                                <span className="input-group-btn">
                                    <button onClick={this.clickNext} className="btn btn-secondary" type="button">Go!</button>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Masonry brakePoints={this.props.brakePoints}>
                            {listPicture}
                        </Masonry>
                    </div>

                </div>
    }
});

let brakePoints = [350, 500, 750, 100];

ReactDOM.render(
    React.createElement(AddPicture, {brakePoints: brakePoints}),
    document.getElementById('pictures')
);
