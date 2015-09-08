define(['react', 'reactRouter', 'allMixins', 'mui', 'js/inputs/inputs', 'js/components/ErrorPanel'], function(React, ReactRouter, allMixins, mui, inputs, ErrorPanel) {

    const {TextInput, HiddenInput} = inputs;
    const {Paper, TextField, RaisedButton} = mui;

    return React.createClass({
        mixins: [
            allMixins.AjaxMixin,
            allMixins.IntlMixin,
            allMixins.FormMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.contacts.form',
                action: 'store',
                formMixin: {
                    fieldRefs: ['name', 'internalName'],
                    optionalFieldRefs: ['internalName'],
                    validateRoute: () => jsRoutes.controllers.Contacts.validate(),
                    validateDelay: 800,
                },
            };
        },
        getDefaultState() {
            return {
                error: null,
            }
        },
        render() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding:"50px"}}>
                    <form onChange={this.onFormChangeValidate}>
                        <ErrorPanel errorKey={this.state.error}/>
                        <HiddenInput ref="id"/> <br/>
                        <TextInput
                            ref="name"
                            floatingLabelText={this.getMsg('inputs.name.label')}
                            /> <br/>
                        <TextInput
                            ref="internalName"
                            floatingLabelText={this.getMsg('inputs.internalName.label')}
                            /> <br/>
                        <RaisedButton
                            onClick={this.onSubmitClick}
                            disabled={!this.state.formMixin.fieldsValid}
                            label={this.getMsg('actions.store')}/>
                    </form>
                </Paper>
            );
        },
        onSubmitClick() {
            const route = (this.getAction() === 'update')
                ? jsRoutes.controllers.Contacts.update(this.props.contactInfoId)
                : jsRoutes.controllers.Contacts.store();
            this.submitForm(route, {
                success: (response) => {
                    if(this.getAction() === 'update')
                        this.transitionTo('contacts-list');
                    else
                        this.transitionTo('contacts-update', {id: response.id});
                },
                error: (error) => this.setState({error: error})
            });
        },
        getAction() {
            return this.props.action;
        },
        componentWillMount() {
            if(this.getAction() === 'update') {
                this.loadItem(jsRoutes.controllers.Contacts.show(this.props.contactInfoId));
            }
        }
    });
});
