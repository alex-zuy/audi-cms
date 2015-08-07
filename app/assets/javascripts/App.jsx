define([
        'react',
        'react-router',
        'javascripts/components/TodoDummy',
        'javascripts/components/Navbar',
    ],
    function(React, ReactRouter, TodoDummy, Navbar) {

        var RouteHandler = ReactRouter.RouteHandler;

        var App = React.createClass({
            render: function() {
                return (
                    <div>
                        <Navbar />
                        <header>App</header>
                        <RouteHandler/>
                    </div>
                )
            }
        });

        return App;
    }
);
