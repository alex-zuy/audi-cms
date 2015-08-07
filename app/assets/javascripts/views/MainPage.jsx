define(['react', 'javascripts/components/TodoDummy'], function(React, TodoDummy) {

    var MainPage = React.createClass({
        render: function() {
            return (
                <div>
                    <h1>Main page</h1>
                    <TodoDummy text='Main page'/>
                </div>
            );
        }
    });

    return MainPage
});
