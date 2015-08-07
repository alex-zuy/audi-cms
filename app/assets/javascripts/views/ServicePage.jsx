define(['react', 'javascripts/components/TodoDummy',], function(React, TodoDummy) {

    var ServicePage = React.createClass({
        render: function() {
            return (
                <div>
                    <h1>Service page</h1>
                    <TodoDummy text='Service page'/>
                </div>
            )
        }
    });

    return ServicePage;
});
