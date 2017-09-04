import React from 'react';
import ReactRouter from 'react-router';
import allMixins from 'mixins/allMixins';
import mui from 'mui';
import inputs from 'inputs/inputs';

const {NumberInput, SelectInput, TextInput} = inputs;
const {RaisedButton} = mui;

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        allMixins.FormMixin,
    ],
    propTypes: {
        onFormSubmited: React.PropTypes.func.isRequired,
        onFormSubmitError: React.PropTypes.func.isRequired,
    },
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.testDrives.form',
            formMixin: {
                fieldRefs: ['modelEditionId', 'preferedContactAddressId', 'clientFullName', 'clientEmail', 'clientNumber'],
                optionalFieldRefs: ['preferedContactAddressId'],
                validateRoute: () => jsRoutes.controllers.TestDrives.validate(),
                validateDelay: 400,
            },
        }
    },
    getInitialState() {
        return {
            models: [],
            chosenModel: null,
            contacts: [],
        }
    },
    render() {
        return (
            <div>
                <form onChange={this.onFormChangeValidate}>
                    <SelectInput
                        ref="models"
                        alternatives={this.modelsAsAlternatives()}
                        onChange={this.modelChosen}
                        initiallyUnselected={true}
                        floatingLabelText={this.getMsg('inputs.models.label')}/>
                    <SelectInput
                        ref="modelEditionId"
                        alternatives={this.editionsOfModelAsAlternatives()}
                        initiallyUnselected={true}
                        disabled={_.isNull(this.state.chosenModel)}
                        floatingLabelText={this.getMsg('inputs.modelEditionId.label')}/>
                    <SelectInput
                        ref="preferedContactAddressId"
                        initiallyUnselected={true}
                        alternatives={this.contactAddressesAsAlternatives()}
                        floatingLabelText={this.getMsg('inputs.preferedContactAddressId.label')}/>
                    {['clientFullName', 'clientEmail', 'clientNumber'].map(field =>
                        <div>
                            <TextInput
                                ref={field}
                                floatingLabelText={this.getMsg(`inputs.${field}.label`)}
                                hintText={this.getMsg(`inputs.${field}.placeholder`)}/>
                            <br/>
                        </div>
                    )}
                    <RaisedButton
                        label={this.getMsg('actions.submit')}
                        primary={true}
                        disabled={!this.state.formMixin.fieldsValid}
                        onClick={this.onSubmitClicked}/>
                </form>
            </div>
        );
    },
    componentDidMount() {
        this.ajax(jsRoutes.controllers.Models.listModelsDetailed(), {
            success: (all) => this.setState({models: all})
        });
        this.ajax(jsRoutes.controllers.Contacts.listDetailed(), {
            success: (all) => this.setState({contacts: _.where(all, {category: 'autoShow'})})
        });
    },
    modelChosen(modelId) {
        this.setState({chosenModel: _.findWhere(this.state.models, {id: modelId})});
        this.refs.modelEditionId.setValue(null);
    },
    onSubmitClicked() {
        this.submitForm(jsRoutes.controllers.TestDrives.store(), {
            success: (id) => this.props.onFormSubmited(),
            failure: () => this.props.onFormSubmitError(),
        })
    },
    modelsAsAlternatives() {
        return this.state.models.map(model => ({
            label: this.getPreferedText(model.name),
            value: model.id
        }));
    },
    editionsOfModelAsAlternatives() {
        if(_.isNull(this.state.chosenModel)) {
            return [];
        }
        else {
            return this.state.chosenModel.editions.map(edition => ({
                label: this.getPreferedText(edition.name),
                value: edition.id
            }));
        }
    },
    contactAddressesAsAlternatives() {
        return _.chain(this.state.contacts).reduce((all, ci) =>
            _.union(all, ci.addresses),
            []
        ).map(ca => ({
                label: ca.address,
                value: ca.id
            })
        ).value();
    }
});
