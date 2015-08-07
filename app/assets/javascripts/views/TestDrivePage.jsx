define(['react', 'javascripts/components/TodoDummy'], function(React, TodoDummy) {

    var TestDrivePage = React.createClass({
        render: function() {
            return (
                <div>
                    <h1>TestDrive page</h1>
                    <TodoDummy text='TestDrive page'/>
                </div>
            )
        }
    });

    return TestDrivePage;
});
