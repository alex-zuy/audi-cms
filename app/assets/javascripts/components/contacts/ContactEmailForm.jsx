define(['react', 'allMixins', 'mui',
    'js/inputs/inputs',
    'js/components/GenericForm',
], function(React, allMixins, mui, inputs, GenericForm) {

    const {TextInput, HiddenInput, I18nTextInput} = inputs;
    const {Paper, RaisedButton} = mui;


    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
        ],
        propTypes: {
            onItemSubmited: React.PropTypes.func.isRequired,
            onCancel: React.PropTypes.func.isRequired,
            item: React.PropTypes.object,
        },
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.contacts.fillForm.emailForm',
            };
        },
        render() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "10px"}}>
                    <RaisedButton
                        onClick={this.props.onCancel}
                        label={this.getMsg('actions.cancel')}/>
                    <GenericForm
                        ref="form"
                        fields={[
                            {ref: 'contactInfoId', editorComponent: HiddenInput, isRequired: true, props: {value: this.props.contactInfoId}},
                            {ref: 'name', editorComponent: I18nTextInput, isRequired: true},
                            {ref: 'email', editorComponent: TextInput, isRequired: true},
                        ]}
                        validateRoute={() => jsRoutes.controllers.Contacts.validateEmail()}
                        onSubmitAttempt={this.onClick}
                        msgKeyPrefix="controlPanel.contacts.fillForm.emailForm"/>
                </Paper>
            );
        },
        componentDidMount() {
            if(typeof this.props.item === 'object') {
                this.refs.form.fillForm(this.props.item);
            }
        },
        onClick() {
            const route = _.isUndefined(this.props.item)
                ? jsRoutes.controllers.Contacts.storeEmail()
                : jsRoutes.controllers.Contacts.updateEmail(this.props.item.id);
            this.refs.form.submitForm(route, {
                success: () => this.props.onItemSubmited()
            });
        }
    });
});
