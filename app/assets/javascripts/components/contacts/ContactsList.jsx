define(['react', 'reactRouter', 'allMixins', 'mui', 'js/widgets/IconedButton'], function(React, ReactRouter, allMixins, mui, IconedButton) {

    const {Paper, IconButton, Dialog} = mui;

    return React.createClass({
        mixins: [
            allMixins.AjaxMixin,
            allMixins.IntlMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.contacts.list',
            };
        },
        getInitialState() {
            return {
                contacts: [],
                itemToDelete: null,
            };
        },
        render() {
            const deleteDialogActions = [
                {text: this.getMsg('actions.delete.cancel'), onTouchTap: this.cancelDelete},
                {text: this.getMsg('actions.delete.confirm'), onTouchTap: this.confirmDelete}
            ];
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "50px"}}>
                    <IconedButton
                        linkButton={true}
                        href={this.makeHref('contacts-store', {}, {action:'store'})}
                        label={this.getMsg('actions.addInfo')}
                        iconName='playlist_add'/>
                    <table>
                        <thead>
                            <tr>
                                <td>{this.getMsg('labels.name')}</td>
                                <td>{this.getMsg('labels.internalName')}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>{
                            this.state.contacts.map((c, index) =>
                                <tr key={`row-${index}`}>
                                    <td>{c.name}</td>
                                    <td>{c.internalName}</td>
                                    <td>
                                        <IconButton
                                            onClick={this.goToUpdate.bind(this, c)}
                                            style={{padding: "0px", height: "auto"}}
                                            iconClassName="material-icons">mode_edit</IconButton>
                                    </td>
                                    <td>
                                        <IconButton
                                            onClick={this.attemptDelete.bind(this, c)}
                                            style={{padding: "0px", height: "auto"}}
                                            iconClassName="material-icons">delete</IconButton>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                    <Dialog
                        ref="deleteDialog"
                        title={this.getMsg('labels.delete.dialogTitle')}
                        actions={deleteDialogActions}
                        actionFocus="submit"
                        modal={true}>
                        {this.getMsg('labels.delete.dialog')}
                    </Dialog>
                </Paper>
            );
        },
        componentWillMount() {
            this.loadContacts();
        },
        loadContacts() {
            this.ajax(jsRoutes.controllers.Contacts.list(), {
                success: (contacts) => this.setState({contacts: contacts})
            });
        },
        attemptDelete(item) {
            this.setState({itemToDelete: item});
            this.refs.deleteDialog.show();
        },
        confirmDelete() {
            this.refs.deleteDialog.dismiss();
            this.ajax(jsRoutes.controllers.Contacts.delete(this.state.itemToDelete.id), {
                success: () => this.loadContacts()
            });
        },
        cancelDelete() {
            this.refs.deleteDialog.dismiss();
        },
        goToUpdate(item) {
            this.transitionTo('contacts-update', {id: item.id});
        }
    });
});
