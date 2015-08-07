define(['react', 'javascripts/components/TodoDummy'], function(React, TodoDummy) {

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

    return ContactsPage;
});
