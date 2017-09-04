import React from 'react';
import ReactRouter from 'react-router';
import allMixins from 'mixins/allMixins';
import mui from 'mui';
import ContactInfoForm from 'components/contacts/ContactInfoForm';

export default React.createClass({
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

