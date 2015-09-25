define(['react',
    'js/inputs/inputs',
    'js/components/GenericForm'
], function(React, inputs, GenericForm) {

    const {TextInput, HiddenInput, I18nTextInput} = inputs;

    return React.createClass({
        render() {
            return (
                <GenericForm
                    ref="form"
                    fields={[
                        {ref: 'id', editorComponent: HiddenInput, isRequired: false},
                        {ref: 'name', editorComponent: I18nTextInput, isRequired: true},
                        {ref: 'internalName', editorComponent: TextInput, isRequired: false},
                    ]}
                    validateRoute={() => jsRoutes.controllers.Contacts.validate()}
                    onSubmitAttempt={this.props.onSubmitItem}
                    msgKeyPrefix="controlPanel.contacts.form"/>
            );
        },
        getForm() {
            return this.refs.form;
        }
    });
});
