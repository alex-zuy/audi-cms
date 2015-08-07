define(['react', 'javascripts/components/TodoDummy',], function(React, TodoDummy) {

    var NewsAndOffersPage = React.createClass({
        render: function() {
            return (
                <div>
                    <h1>News and offers page</h1>
                    <TodoDummy text='News and offers page'/>
                </div>
            )
        }
    });

    return NewsAndOffersPage;
});
