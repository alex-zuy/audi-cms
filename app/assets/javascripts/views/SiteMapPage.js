import React from 'react';
import TodoDummy from 'components/TodoDummy';

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

export default SiteMapPage;
