define(['react', 'react-router', 'mui', 'intl-mixin'], function(React, ReactRouter, mui, IntlMixin) {

    var Toggle = mui.Toggle;
    var RouteHandler = ReactRouter.RouteHandler;


    var ManagersControl = React.createClass({
        mixins: [
            IntlMixin,
        ],
        getInitialState: function() {
            return {
                managers: [{
                    id: 12,
                    fullName: "Some mgr",
                    email: "email",
                    isAdmin: true,
                }],
            }
        },
        render: function() {
            return (
                <div>
                    <RouteHandler/>
                </div>
            );
        }
    });

    return ManagersControl;
});
