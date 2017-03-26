var Button = Reactstrap.Button;

function isIncluded(picture, listPicture){

    for(var i=0; i < listPicture.length; i++){
        if(picture.identification === listPicture[i].identification){
            return true;
        }
    }
    return false;
}

var Picture = React.createClass({

    getInitialState: function(){
        console.log(this.props.picture)
        return {
            isDisplay: !isIncluded(this.props.picture, this.props.pictures),
            picturePageUrl: '/picture/' + this.props.picture.identification,
        }
    },

    remove: function(){
        $.ajax({
            method: "POST",
            url: '/picture/api/picutes-delet/',
            dataType: 'json',
            data: {'identification_board': this.props.board_id,
                   'identification_picture': this.props.picture.identification},
            async:false,
        })
        

        this.props.updatePicture()
    },

    attach: function(){
        this.props.handlerAttach(this.props.picture)
    },

    edit: function(){
    },

    render: function(){
        var remove_btn, attach_btn, edit_btn

        if(!this.props.is_auth){
            actions = <span></span>
        }
        else{
            if(this.props.is_auth_board){
                remove_btn = <Button color="danger" size="sm" onClick={this.remove}>REMOVE</Button> 
            }
            else{
                attach_btn = <Button onClick={this.attach} size="sm">SAVE</Button>
            }

            // if(this.props.auth_username == this.props.picture.user){
            //     edit_btn = <Button onClick={this.edit} size="sm">edit</Button> 
            // }
        }
        
        if(this.state.isDisplay){
            return(
                <div className='item'>
                    <a href={this.state.picturePageUrl}>
                        <img src={this.props.picture.url} alt="" className="img-fluid" />
                    </a>
                    <div className='buttons-from-block'>
                        {remove_btn}
                        {attach_btn}
                        {edit_btn}
                    </div>
                </div>
            )
        }
        else{
            return <div></div>
        }
    }
});

module.exports = Picture