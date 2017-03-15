var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function getMin(a, b){
    if(a.get_item() === undefined) return b
    if(b.get_item() === undefined) return a

    if(parseInt(Date.parse(a.get_item().date)) >  parseInt(Date.parse(b.get_item().date))){
        return a
    }
    else{
        return b
    }
}


function isInclude(item, arr){
    for(var i = 0; i < arr.length; i++){
        if(item.identification === arr[i].identification)
        {
            return true
        }
    }
    return false
}

function getSort(a, b, c, d, count, arr){

    var result = []

    while(result.length < count){
        var min = getMin(getMin(a, b), getMin(c, d))

        if(min.get_item() === undefined){
            return result
        }
        
        if(isInclude(min.get_item(), arr) ||  isInclude(min.get_item(), result)){
            min.del_item()
            console.log('!!!!!')
        }
        else{
            result.push(min.get_item());
            min.del_item()
        }

    }
    return result
}

function BorderData(url, username){
    this.step = 0
    this.username = username
    this.url = url
    this.array = []
    this.isEmpty = false

    this.update = function(){
        self = this
        $.ajax({
            url: this.url,
            dataType: 'json',
            data: {username: username,
                   range_left: this.step * 5,
                   rande_right: this.step * 5 + 5},
            success: function(data){
                self.array = data
            },
            async:false,
        });
    }

    this.get_item = function(){
        if(this.isEmpty){
            return undefined
        }

        if(this.array.length == 0){
            this.update()
            this.step = (this.step + 1)
            if(this.array.length == 0){
                this.isEmpty = true
            }   
        }

        return this.array[0]
    }

    this.del_item = function(){
        if(this.isEmpty){
            return undefined
        }
        
        this.array = this.array.slice(1)
    }

}


var Picture = React.createClass({
    render: function(){
        return  <div className='col-xs-3 block-s'>
                    <img src={this.props.i.url} alt="" className="img-responsive" />
                </div>
    }
});

var Pictures = React.createClass({
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
        console.log(1)
        var tempArray =  getSort(this.state.like, this.state.sub, this.state.board, this.state.created, 8, this.state.my_array)
        this.setState({my_array: this.state.my_array.concat(tempArray)})
    },

    getUserPage: function(){
        var url = window.location.pathname
        var username = url.split('/')[2]
        return username
    },

    getInitialState: function(){
        window.addEventListener("scroll", this.handleScroll);
        
        var username = this.getUserPage()
        
        var like = new BorderData('/picture/api/picutes-like/', username)
        var sub = new BorderData('/picture/api/picture-from-sub-board/', username)
        var board = new BorderData('/picture/api/picture-from-board/', username)
        var created = new BorderData('/picture/api/picture-created/', username)
        var my_array = getSort(like, sub, board, created, 8, [])

        return {my_array: my_array,
                like: like,
                sub: sub,
                board: board,
                created: created};
    },
    
    render: function(){
        var listBlog = this.state.my_array.map(function(s, i){
            return <Picture key={i} i={s}/>
        })
        return  <div className="container-fluid">
                    <div className="row">
                        {listBlog}
                    </div>
                </div>
    }
});


ReactDOM.render(
    React.createElement(Pictures, {}), 
    document.getElementById('pictures')
);

var sub = new BorderData('/picture/api/picture-from-sub-board/','kluzhev')