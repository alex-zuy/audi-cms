define(['react', 'react-router', 'mui', 'intl-mixin', 'javascripts/mixins/AjaxMixin', 'javascripts/widgets/IconedButton'],
    function(React, ReactRouter, mui, IntlMixin, AjaxMixin, IconedButton) {

    var Toggle = mui.Toggle;
    var FlatButton = mui.FlatButton;
    var Dialog = mui.Dialog;
    var Link = ReactRouter.Link;

    var ManagersList = React.createClass({
        mixins: [
            ReactRouter.Navigation,
            AjaxMixin,
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
                deletingManager: null,
            }
        },
        render: function() {
            var tableRows = this.state.managers.sort(function(l,r) {
                if(l.fullName < r.fullName) return -1;
                else if(l.fullName > r.fullName) return 1;
                else return 0;
            }).map(function(mgr) {
                return (
                    <tr key={mgr.id}>
                        <td className="hover-group delete" onClick={this.deleteManager.bind(this, mgr.id)}>
                            <i className="material-icons" style={{fontSize: "24px"}}>delete</i>
                        </td>
                        <td className="hover-group update" onClick={this.goToUpdate.bind(this, mgr.id)}>
                            {mgr.fullName}
                        </td>
                        <td className="hover-group update" onClick={this.goToUpdate.bind(this, mgr.id)}>
                            {mgr.email}
                        </td>
                        <td className="hover-group update" onClick={this.goToUpdate.bind(this, mgr.id)}>
                            <i className="material-icons" style={{fontSize: "24px"}}>mode_edit</i>
                        </td>
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
            var dialogButtons = [
                <FlatButton
                    key="cancel"
                    label={this.getMsg('actions.delete.cancel')}
                    secondary={true}
                    onClick={this.cancelDelete}/>,
                <FlatButton
                    key="confirm"
                    label={this.getMsg('actions.delete.confirm')}
                    primary={true}
                    onClick={this.confirmDelete}/>
            ];
            return (
                <div>
                    <table className="manager-list">
                        <thead>
                        <tr>
                            <th></th>
                            <th>{this.getMsg('labels.table.fullName')}</th>
                            <th>{this.getMsg('labels.table.email')}</th>
                            <th></th>
                            <th>{this.getMsg('labels.table.password')}</th>
                            <th>{this.getMsg('labels.table.isAdmin')}</th>
                        </tr>
                        </thead>
                        <tbody>{tableRows}</tbody>
                    </table>
                    <IconedButton
                        linkButton={true}
                        href={this.makeHref('manager-store')}
                        label={this.getMsg('actions.add')}
                        iconName="person_add"/>
                    <Dialog
                        ref="deleteDialog"
                        title={this.getMsg('labels.deleting')}
                        actions={dialogButtons}>
                        {this.getMsg('labels.confirmDelete')}
                    </Dialog>
                </div>
            );
        },
        componentWillMount: function() {
            this.loadManagers();
        },
        goToUpdate: function(id) {
            this.transitionTo('manager-update', {id: id});
        },
        deleteManager: function(id) {
            this.setState({deletingManager: id});
            this.refs.deleteDialog.show();
        },
        confirmDelete: function() {
            this.ajax(jsRoutes.controllers.Managers.delete(this.state.deletingManager), {
                complete: function() {
                    this.loadManagers();
                }.bind(this)
            });
            this.refs.deleteDialog.dismiss();
        },
        cancelDelete: function() {
            this.refs.deleteDialog.dismiss();
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
