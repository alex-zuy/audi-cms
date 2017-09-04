import React from 'react';
import TodoDummy from 'components/TodoDummy';

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

export default HistoryPage;
