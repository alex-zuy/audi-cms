define(['react', 'reactRouter', 'allMixins', 'mui', 'js/widgets/HiddenInput', 'js/components/ErrorPanel'], function(React, ReactRouter, allMixins, mui, HiddenInput, ErrorPanel) {

    const {Paper, TextField, RaisedButton} = mui;

    return React.createClass({
        mixins: [
            allMixins.AjaxMixin,
            allMixins.IntlMixin,
            allMixins.FormMixin,
            allMixins.DelayedFormValidateMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.contacts.form',
                formMixin: {
                    fieldRefs: ['name', 'internalName'],
                    optionalFieldRefs: ['internalName'],
                    validateRoute: () => jsRoutes.controllers.Contacts.validate(),
                    submitRoute() {
                        switch(this.getAction()) {
                            case 'store': return jsRoutes.controllers.Contacts.store();
                            case 'update': return jsRoutes.controllers.Contacts.update();
                            default: throw new Error(`Invalid action '${action}'`);
                        }
                    }
                },
                delayedFormValidateMixin: {
                    delay: 800,
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
                    <h5>{this.getMsg('labels.title')}</h5>
                    <form onChange={this.onFormChangedCallback}>
                        <ErrorPanel errorKey={this.state.error}/>
                        <HiddenInput ref="id"/> <br/>
                        <TextField
                            ref="name"
                            floatingLabelText={this.getMsg('inputs.name.label')}
                            /> <br/>
                        <TextField
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
            this.submitForm({
                success: (response) => { console.log(response); this.transitionTo('contacts-update', {id: response.id});},
                error: (error) => this.setState({error: error})
            });
        },
        getAction() {
            return this.props.query.action;
        },
        componentWillMount() {
            if(this.getAction() === 'update') {
                this.ajax(jsRoutes.controller.Contacts.show(this.props.params.id), {
                    success: (model) => this.fillForm(model),
                });
            }
        }
    });
});
