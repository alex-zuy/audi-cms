import React from 'react';
import allMixins from 'mixins/allMixins';
import mui from 'mui';
import inputs from 'inputs/inputs';
import GenericForm from 'components/GenericForm';

const {TextInput, HiddenInput, I18nTextInput} = inputs;
const {Paper, RaisedButton} = mui;

export default React.createClass({
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
            msgKeyPrefix: 'controlPanel.contacts.fillForm.numberForm',
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
                        {ref: 'number', editorComponent: TextInput, isRequired: true},
                    ]}
                    validateRoute={() => jsRoutes.controllers.Contacts.validateNumber()}
                    onSubmitAttempt={this.onClick}
                    msgKeyPrefix="controlPanel.contacts.fillForm.numberForm"/>
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
            ? jsRoutes.controllers.Contacts.storeNumber()
            : jsRoutes.controllers.Contacts.updateNumber(this.props.item.id);
        this.refs.form.submitForm(route, {
            success: () => this.props.onItemSubmited()
        });
    }
});
