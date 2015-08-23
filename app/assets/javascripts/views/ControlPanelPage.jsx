define(["react", "react-router", "javascripts/components/TodoDummy", "mui"],
    function(React, ReactRouter, TodoDummy, mui) {
        var ControlPanelPage = React.createClass({
            render: function() {
                return (
                    <ReactRouter.RouteHandler />
                );
            }
        });

        return ControlPanelPage;
    });
