define(['react', 'javascripts/components/TodoDummy',], function(React, TodoDummy) {

    var HistoryPage = React.createClass({
        render: function() {
            return (
                <div>
                    <h1>History page</h1>
                    <TodoDummy text='History page'/>
                </div>
            )
        }
    });

    return HistoryPage;
});
