define(['react', 'reactRouter', 'js/components/Navbar'], function(React, ReactRouter, Navbar) {

    var RouteHandler = ReactRouter.RouteHandler;

    return React.createClass({
        render: function() {
            return (
                <div>
                    <header>
                        <Navbar/>
                    </header>
                    <RouteHandler/>
                </div>
            );
        }
    })
});
