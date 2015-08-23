define(['react', 'react-router', 'mui', 'intl-mixin'], function(React, ReactRouter, mui, IntlMixin) {

    var Toggle = mui.Toggle;
    var Link = ReactRouter.Link;


    var ManagersList = React.createClass({
        mixins: [
            IntlMixin,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'managersCtl.list'
            };
        },
        getInitialState: function() {
            return {
                managers: [],
            }
        },
        render: function() {
            var rows = this.state.managers.sort(function(l,r) {
                if(l.fullName < r.fullName) return -1;
                else if(l.fullName > r.fullName) return 1;
                else return 0;
            }).map(function(mgr) {
                return (
                    <tr key={mgr.id}>
                        <td>{mgr.fullName}</td>
                        <td>{mgr.email}</td>
                        <td>
                            <Link to="manager-change-password" params={{id: mgr.id}}>
                                {this.getMsg('actions.changePassword')}
                            </Link>
                        </td>
                        <td>
                            <Toggle
                                ref={'toggle'+mgr.id}
                                value={mgr.id+''}
                                defaultToggled={mgr.isAdmin}
                                onToggle={this.switchAdmin}/>
                        </td>
                    </tr>
                );
            }, this);
            return (
                <table>
                    <thead>
                    <tr>
                        <th>{this.getMsg('labels.table.fullName')}</th>
                        <th>{this.getMsg('labels.table.email')}</th>
                        <th>{this.getMsg('labels.table.password')}</th>
                        <th>{this.getMsg('labels.table.isAdmin')}</th>
                    </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            );
        },
        componentWillMount: function() {
            this.loadManagers();
        },
        loadManagers: function() {
            var route = jsRoutes.controllers.Managers.list();
            $.ajax({
                url: route.url,
                success: function(managers) {
                    this.setState({managers: managers});
                }.bind(this)
            });
        },
        switchAdmin: function(e, grantAdmin) {
            var id = e.target.value;
            var route = grantAdmin
                ? jsRoutes.controllers.Managers.grantAdmin(id)
                : jsRoutes.controllers.Managers.revokeAdmin(id);
            var oldValue = !grantAdmin;

            $.ajax({
                method: route.type,
                url: route.url,
                error: function(managers) {
                    this.refs['toggle'+id].setToggled(oldValue);
                }.bind(this)
            });
        }
    });

    return ManagersList;
});
