define(['react', 'javascripts/components/TodoDummy',], function(React, TodoDummy) {

    var SiteMapPage = React.createClass({
        render: function() {
            return (
                <div>
                    <h1>SiteMap page</h1>
                    <TodoDummy text='SiteMap page'/>
                </div>
            )
        }
    });

    return SiteMapPage;
});
