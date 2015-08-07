define(['react', 'javascripts/components/TodoDummy',], function(React, TodoDummy) {

    var ModelsPage = React.createClass({
        render: function() {
            return (
                <div>
                    <h1>Models page</h1>
                    <TodoDummy text='Models page'/>
                </div>
            )
        }
    });

    return ModelsPage;
});
