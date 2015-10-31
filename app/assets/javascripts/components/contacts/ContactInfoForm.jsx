define(['react', 'allMixins',
    'js/inputs/inputs',
    'js/components/GenericForm'
], function(React, allMixins, inputs, GenericForm) {

    const {SelectInput, HiddenInput, I18nTextInput} = inputs;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
        ],
        render() {
            return (
                <GenericForm
                    ref="form"
                    fields={[
                        {ref: 'id', editorComponent: HiddenInput, isRequired: false},
                        {ref: 'name', editorComponent: I18nTextInput, isRequired: true},
                        {ref: 'category', editorComponent: SelectInput, isRequired: true, props: {
                            alternatives: ['autoShow', 'service'].map(category =>({
                                label: this.getIntlMessage(`generic.contactCategories.${category}`),
                                value: category,
                            })),
                            initiallyUnselected: false,
                        }},
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
