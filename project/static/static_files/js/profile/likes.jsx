var Picture = React.createClass({
    render: function(){
        return  <div className='col-xs-3 block-s'>
                    <img src={this.props.i.url} alt="" className="img-responsive" />
                </div>
    }
});

var Pictures = React.createClass({
    getUserPage: function(){
        var url = window.location.pathname
        var username = url.split('/')[2]
        return username
    },

    
    handleScroll:function(e){
        var inHeight = window.innerHeight;
        var scrollT = $(window).scrollTop();
        var totalScrolled = scrollT+inHeight;
        var documentHeight = $( document ).height();

        if(totalScrolled + 10 > documentHeight){
            this.getComment();
        }
    },

    getComment:function(){
        console.log(1);
        this.setState({arr: this.state.arr.concat(this.getPicture(this.state.step, this.state.username))})
        this.state.state++
    },

    getPicture: function(step, username){
        var array

        $.ajax({
            url: '/picture/api/picutes-like/',
            dataType: 'json',
            data: {username: username,
                   range_left: step * 8,
                   rande_right: step * 8 + 8},
            success: function(data){
                array = data
            },
            async:false,
        });

        return array
    },

    getInitialState: function(){
        window.addEventListener("scroll", this.handleScroll);

        var step = 0
        var username = this.getUserPage()
        var arr = this.getPicture(step, username)

        return {step: 1,
                username: username,
                arr: arr}
    },

    render: function(){
        var listBlog = this.state.arr.map(function(s, i){
            return <Picture key={i} i={s}/>
        })
        return <div className="container-fluid">
                    <div className="row">
                        {listBlog}
                    </div>
                </div>
    }
})

ReactDOM.render(
    React.createElement(Pictures, {}), 
    document.getElementById('pictures')
);