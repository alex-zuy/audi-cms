define(['react', 'allMixins', 'mui',
    'js/widgets/Switch',
    'js/components/ConfirmDialog'
], function(React, allMixins, mui, switchWidget, ConfirmDialog) {

    const {IconButton,FloatingActionButton, FontIcon} = mui;
    const {Switch, Case, Default} = switchWidget;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
        ],
        propTypes: {
            data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
            fieldNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
            itemForm: React.PropTypes.func.isRequired,
            itemFormProps: React.PropTypes.object,
            onItemSubmited: React.PropTypes.func,
            performDelete: React.PropTypes.func.isRequired,
            fieldToStringMapper: React.PropTypes.func.isRequired,
        },
        getDefaultProps() {
            return {
                fieldToStringMapper: (key, value) => value,
            };
        },
        getInitialState() {
            return {
                action: '',
                actionData: null,
            };
        },
        render() {
            return (
                <div>
                    <table className="compactTable">
                        <thead>
                            <tr>
                                { this.props.fieldNames.map((field) => <td>{this.getMsg(`labels.${field}`)}</td> ) }
                                <td></td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>{
                            this.props.data.map((item, index) =>
                                <tr key={`row-${index}`}>
                                    { this.props.fieldNames.map((field) => <td>{this.props.fieldToStringMapper(field, item[field])}</td> ) }
                                    <td>
                                        <IconButton
                                            onClick={this.updateItem.bind(this, item)}
                                            style={{padding: "0px", height: "auto"}}
                                            iconClassName="material-icons">mode_edit</IconButton>
                                    </td>
                                    <td>
                                        <IconButton
                                            onClick={this.attemptDeleteItem.bind(this, item)}
                                            style={{padding: "0px", height: "auto"}}
                                            iconClassName="material-icons">delete</IconButton>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                    <Switch of={this.state.action}>
                        <Case on="update">
                            <this.props.itemForm
                                onItemSubmited={this.onItemSubmited}
                                onCancel={this.onCancel}
                                item={this.state.actionData}
                                {...this.props.itemFormProps}/>
                        </Case>
                        <Case on="store">
                            <this.props.itemForm
                                onItemSubmited={this.onItemSubmited}
                                onCancel={this.onCancel}
                                {...this.props.itemFormProps}/>
                        </Case>
                        <Default>
                            <FloatingActionButton
                                mini={true}
                                onClick={this.storeItem}
                                style={{marginLeft: "2%"}}>
                                <FontIcon className="material-icons">playlist_add</FontIcon>
                            </FloatingActionButton>
                        </Default>
                    </Switch>
                    <ConfirmDialog
                        ref="deleteDialog"
                        onConfirm={this.confirmDeleteItem}
                        onCancel={this.cancelDeleteItem}
                        title={this.getMsg('labels.delete.dialogTitle')}>
                        {this.getMsg('labels.delete.dialog')}
                    </ConfirmDialog>
                </div>
            );
        },
        storeItem() {
            this.setState({action: 'store'});
        },
        updateItem(item) {
            this.setState({action: 'update', actionData: item});
        },
        attemptDeleteItem(item) {
            this.setState({action: 'delete', actionData: item});
            this.refs.deleteDialog.show();
        },
        confirmDeleteItem() {
            this.props.performDelete(this.state.actionData);
            this.setState({action: ''});
        },
        cancelDeleteItem() {
            this.setState({action:''});
        },
        onItemSubmited() {
            this.setState({action:''});
            if(this.props.onItemSubmited) {
                this.props.onItemSubmited();
            }
        },
        onCancel() {
            this.setState({action:''});
        },
    });
});
