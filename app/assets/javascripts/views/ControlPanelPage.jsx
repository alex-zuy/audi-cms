define(["react", "reactRouter", "javascripts/components/TodoDummy", "mui", "allMixins"],
    function(React, ReactRouter, TodoDummy, mui, allMixins) {

        const {Menu, MenuItem, FontIcon} = mui;

        const menuItemsData = [
            { msgKey: "managers", route: "managers-list", icon: "supervisor_account"},
            { msgKey: "contacts", route: "contacts-list", icon: "perm_phone_msg"},
        ];

        return React.createClass({
            mixins: [
                ReactRouter.Navigation,
                allMixins.IntlMixin,
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
                        value={data.route}
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
