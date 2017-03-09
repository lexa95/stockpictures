var Picture = React.createClass({
    render: function(){
        return (
                <a href={this.props.picture.resource_url} target="_blank">
                    <div className='col-xs-3'>
                        <img src={this.props.picture.url} alt="" className="img-responsive" />
                    </div>
                </a>
    )}
});

var Pictures = React.createClass({
    getInitialState: function(){
        var pictures
        var data = {
            'username': this.props.username,
            'identification': this.props.board_identification
        }

        var url = '/picture/api/picutes-in-board/'

        $.ajax({
            url: url,
            dataType: 'json',
            data: data,
            success: function(data){
                pictures = data
                console.log(data)
            },
            async:false,
        })
        console.log(pictures)
        return {pictures: pictures}
    },

    render: function(){
        
        var listPictures = this.state.pictures.map(function(s, i){
            return <Picture picture={s} key={i} index={i}/>
        });
        return (<div>
                    <div className="container-fluid">
                        <div className="row">
                        {listPictures}
                        </div>
                    </div>
                </div>
    )}
});

var url = window.location.pathname
var username = url.split('/')[2]
var board_identification = url.split('/')[3]


ReactDOM.render(
    React.createElement(Pictures, {username: username, board_identification: board_identification}), document.getElementById('pictures')
);