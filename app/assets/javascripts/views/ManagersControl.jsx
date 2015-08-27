define(['react', 'reactRouter', 'mui', 'allMixins'], function(React, ReactRouter, mui, allMixins) {

    var Toggle = mui.Toggle;
    var RouteHandler = ReactRouter.RouteHandler;


    var ManagersControl = React.createClass({
        mixins: [
            allMixins.IntlMixin,
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
