define(['react', 'reactRouter', 'allMixins', 'mui',
    'js/components/contacts/ContactInfoForm'
], function(React, ReactRouter, allMixins, mui, ContactInfoForm) {

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
                <div>
                    <ContactInfoForm ref="form" onSubmitItem={this.onSubmitClick}/>
                </div>
            );
        },
        onSubmitClick() {
            this.refs.form.getForm().submitForm(jsRoutes.controllers.Contacts.store(), {
                success: (response) => this.transitionTo('contacts-update', {id: response.id}),
            });
        },
    });
});
