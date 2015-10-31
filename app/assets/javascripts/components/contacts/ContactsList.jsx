define(['react', 'reactRouter', 'allMixins', 'mui', 'js/widgets/IconedButton', 'js/components/ConfirmDialog'], function(React, ReactRouter, allMixins, mui, IconedButton, ConfirmDialog) {

    const {IconButton} = mui;

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
            return (
                <div>
                    <IconedButton
                        linkButton={true}
                        href={this.makeHref('contacts-store', {}, {action:'store'})}
                        label={this.getMsg('actions.addInfo')}
                        iconName='playlist_add'/>
                    <table>
                        <thead>
                            <tr>
                                <td>{this.getMsg('labels.name')}</td>
                                <td>{this.getMsg('labels.category')}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>{
                            this.state.contacts.map((c, index) =>
                                <tr key={`row-${index}`}>
                                    <td>{this.getPreferedText(c.name)}</td>
                                    <td>{c.category}</td>
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
                    <ConfirmDialog
                        ref="deleteDialog"
                        onConfirm={this.confirmDelete}
                        title={this.getMsg('labels.delete.dialogTitle')}>
                        {this.getMsg('labels.delete.dialog')}
                    </ConfirmDialog>
                </div>
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
        goToUpdate(item) {
            this.transitionTo('contacts-update', {id: item.id});
        }
    });
});
