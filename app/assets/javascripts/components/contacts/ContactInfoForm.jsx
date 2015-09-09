define(['react', 'reactRouter', 'allMixins', 'mui',
    'js/inputs/inputs',
    'js/components/ErrorPanel',
    'js/components/GenericForm'
], function(React, ReactRouter, allMixins, mui, inputs, ErrorPanel, GenericForm) {

    const {TextInput, HiddenInput} = inputs;

    return React.createClass({
        render() {
            return (
                <GenericForm
                    ref="form"
                    fields={[
                        {ref: 'id', editorComponent: HiddenInput, isRequired: false},
                        {ref: 'name', editorComponent: TextInput, isRequired: true},
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
