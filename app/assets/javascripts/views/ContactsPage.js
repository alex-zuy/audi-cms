import React from 'react';
import TodoDummy from 'components/TodoDummy';

var ContactsPage = React.createClass({
    render: function() {
        return (
            <div>
                <h1>Contacts page</h1>
                <TodoDummy text='Contacts page'/>
            </div>
        )
    }
});

export default ContactsPage;
