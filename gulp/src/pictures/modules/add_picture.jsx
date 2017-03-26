var AddPicture = React.createClass({
    getInitialState: function(){
        return{
            resource_url: '',
            arr_pictres: []
        }
    },

    render: function(){
        return  <div className='item'>
                    <a href='/picture/add/'>
                        <img src='/media/board/add-new.jpg' className="img-fluid"/>
                    </a>  
                </div>
    }
});

module.exports = AddPicture