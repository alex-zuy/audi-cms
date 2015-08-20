define([
        'react',
        'react-router',
        'javascripts/components/TodoDummy',
        'javascripts/components/Navbar',
        'mui'
    ],
    function(React, ReactRouter, TodoDummy, Navbar, mui) {

        var RouteHandler = ReactRouter.RouteHandler;
        var RaisedButton = mui.RaisedButton;
        var ThemeManager = new mui.Styles.ThemeManager();

        var App = React.createClass({
            childContextTypes: {
                muiTheme: React.PropTypes.object
            },
            getChildContext: function() {
                return {
                    muiTheme: ThemeManager.getCurrentTheme()
                }
            },
            render: function() {
                return (
                    <div>
                        <Navbar />
                        <div className="container">
                            <RouteHandler/>
                        </div>
                    </div>
                )
            }
        });

        return App;
    }
);
