define(["react", "react-router", "javascripts/components/TodoDummy", "mui", "intl-mixin"],
    function(React, ReactRouter, TodoDummy, mui, IntlMixin) {

        const {Menu, MenuItem, FontIcon} = mui;

        const menuItemsData = [
            { msgKey: "managers", route: "managers-list", icon: "supervisor_account"},
            { msgKey: "managers", route: "manager-store", icon: "supervisor_account"},
        ];

        return React.createClass({
            mixins: [
                ReactRouter.Navigation,
                IntlMixin,
            ],
            getDefaultProps() {
                return {
                    msgKeyPrefix: 'controlPanel.navbar.labels',
                };
            },
            render: function() {
                const menuItems = menuItemsData.map((data, index) =>
                    <MenuItem
                        key={`menu-item-${index}`}
                        primaryText={this.getMsg(data.msgKey)}
                        value={this.makeHref(data.route)}
                        leftIcon={<FontIcon className="material-icons">{data.icon}</FontIcon>}/>
                );
                return (
                    <div style={{width: "99%"}}>
                        <div className="left" style={{width: "20%"}}>
                            <Menu
                                onChange={this.switchPage}
                                autoWidth={false}
                                style={{position: "relative"}}>
                                {menuItems}
                            </Menu>
                        </div>
                        <div className="left" style={{width: "79%", marginLeft: "1%"}}>
                            <ReactRouter.RouteHandler />
                        </div>
                    </div>
                );
            },
            switchPage(e, value) {
                this.transitionTo(value);
            }
        });
    });
