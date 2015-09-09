define(['react', 'reactRouter', 'allMixins', 'mui',
    'js/inputs/inputs',
    'js/components/ErrorPanel',
    'js/components/contacts/ContactInfoForm'
], function(React, ReactRouter, allMixins, mui, inputs, ErrorPanel, ContactInfoForm) {

    const {TextInput, HiddenInput} = inputs;
    const {Paper, TextField, RaisedButton} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.contacts.form',
            };
        },
        render() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding:"50px"}}>
                    <ContactInfoForm ref="form" onSubmitItem={this.onSubmitClick}/>
                </Paper>
            );
        },
        onSubmitClick() {
            this.refs.form.getForm().submitForm(jsRoutes.controllers.Contacts.store(), {
                success: (response) => this.transitionTo('contacts-update', {id: response.id}),
            });
        },
    });
});
