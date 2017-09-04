import React from 'react';
import allMixins from 'mixins/allMixins';
import mui from 'mui';
import ReactRouter from 'react-router';
import GenericForm from 'components/GenericForm';
import inputs from 'inputs/inputs';
import IconedButton from 'widgets/IconedButton';
import ConfirmDialog from 'components/ConfirmDialog';

const {HiddenInput, SelectInput, NumberInput, I18nTextInput} = inputs;
const {IconButton, RaisedButton, Paper} = mui;

const EditionForm = React.createClass({
    displayName: 'EditionForm',
    mixins: [
        allMixins.AjaxMixin,
        allMixins.IntlMixin,
    ],
    propTypes: {
        editionId: React.PropTypes.number.isRequired,
        modelId: React.PropTypes.number.isRequired,
        onAfterSubmit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
    },
    getDefaultProps() {
        return {
            editionId: null,
            modelId: null,
            msgKeyPrefix: "controlPanel.models.updateEditions.form",
        }
    },
    getInitialState() {
        return {
            modelId: _.isNull(this.props.modelId) ? null : parseInt(this.props.modelId),
        }
    },
    render() {
        return (
            <Paper zDepth={2} rounded={false} style={{padding: '10px'}}>
                <RaisedButton
                    label={this.getMsg('actions.cancel')}
                    onClick={this.props.onCancel}
                    />
                <GenericForm
                    ref="form"
                    fields={this._getFormFieldProps()}
                    validateRoute={() => jsRoutes.controllers.Models.validateEdition()}
                    msgKeyPrefix={this.props.msgKeyPrefix}
                    onSubmitAttempt={this.onSubmit}
                    msgKeyPrefix="controlPanel.models.updateEditions.form"/>
            </Paper>
        );
    },
    componentDidMount() {
        if(!_.isNull(this.props.editionId)) {
            this.ajax(jsRoutes.controllers.Models.showEdition(this.props.editionId), {
                success: (edition) => {
                    this.setState({modelId: edition.modelId});
                    this.refs.form.fillForm(edition);
                }
            });
        }
    },
    onSubmit() {
        const route = _.isNull(this.props.editionId)
            ? jsRoutes.controllers.Models.storeEdition()
            : jsRoutes.controllers.Models.updateEdition(this.props.editionId);
        this.refs.form.submitForm(route, {
            complete: () => this.props.onAfterSubmit()
        });
    },
    _getFormFieldProps() {
        const enumAlternatives = (enumName, enumValues) =>
            enumValues.map((value) => ({
                label: this.getIntlMessage(`generic.enumerations.${enumName}.${value}`),
                value: value,
            }));

        return [
            {ref: 'modelId', editorComponent: HiddenInput, isRequired: true, props: {
                value: this.state.modelId,
            }},
            {ref: 'name', editorComponent: I18nTextInput, isRequired: true},
            {ref: 'engineType', editorComponent: SelectInput, isRequired: true, props: {
                alternatives: enumAlternatives('engineTypes', ['diesel', 'benzine']),
                initiallyUnselected: true,
            }},
            {ref: 'engineVolume', editorComponent: NumberInput, isRequired: true},
            {ref: 'engineCylinderCount', editorComponent: NumberInput, isRequired: true, props: {
                integerOnly: true,
            }},
            {ref: 'enginePower', editorComponent: NumberInput, isRequired: true, props: {
                integerOnly: true,
            }},
            {ref: 'fuelTank', editorComponent: NumberInput, isRequired: true, props: {
                integerOnly: true,
            }},
            {ref: 'fuelConsumption', editorComponent: NumberInput, isRequired: true},
            {ref: 'acceleration', editorComponent: NumberInput, isRequired: true},
            {ref: 'maxSpeed', editorComponent: NumberInput, isRequired: true, props: {
                integerOnly: true,
            }},
            {ref: 'transmissionType', editorComponent: SelectInput, isRequired: true, props: {
                alternatives: enumAlternatives('transmissionTypes', ['front', 'rear', 'all', 'adjustable']),
                initiallyUnselected: true,
            }},
            {ref: 'gearboxType', editorComponent: SelectInput, isRequired: true, props: {
                alternatives: enumAlternatives('gearboxTypes', ['automatic', 'manual']),
                initiallyUnselected: true,
            }},
            {ref: 'gearboxLevels', editorComponent: NumberInput, isRequired: true, props: {
                integerOnly: true,
            }}
        ];
    }
});

export default React.createClass({
    displayName: 'ModelEditionsFillForm',
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        ReactRouter.Navigation,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.models.updateEditions'
        }
    },
    getInitialState() {
        return {
            editions: [],
            editionInForm: null,
            editionToDelete: null,
        }
    },
    render() {
        const getEnumLabel = (enumName, enumValue) =>
            this.getIntlMessage(`generic.enumerations.${enumName}.${enumValue}`);

        return (
            <div>
                <h5>{this.getMsg('labels.modelEditions')}</h5>
                <IconedButton
                    iconName="arrow_back"
                    label={this.getMsg('labels.backToEditMenu')}
                    linkButton={true}
                    href={this.makeHref('model-edit-menu', {modelId: this.props.params.modelId})}/>
                <table>
                    <thead>
                        <tr>
                            <th>{this.getMsg('labels.feature')}</th>{
                                this.state.editions.map((edition) =>
                                    <th>{this.getPreferedText(edition.name)}</th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.getMsg('form.inputs.engineType.label')}</td>{
                                this.state.editions.map((edition) =>
                                    <td>{getEnumLabel('engineTypes', edition.engineType)}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>{this.getMsg('form.inputs.engineVolume.label')}</td>{
                                this.state.editions.map((edition) =>
                                    <td>{edition.engineVolume}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>{this.getMsg('form.inputs.engineCylinderCount.label')}</td>{
                                this.state.editions.map((edition) =>
                                        <td>{edition.engineCylinderCount}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>{this.getMsg('form.inputs.enginePower.label')}</td>{
                                this.state.editions.map((edition) =>
                                        <td>{edition.enginePower}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>{this.getMsg('form.inputs.fuelTank.label')}</td>{
                                this.state.editions.map((edition) =>
                                        <td>{edition.fuelTank}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>{this.getMsg('form.inputs.fuelConsumption.label')}</td>{
                                this.state.editions.map((edition) =>
                                        <td>{edition.fuelConsumption}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>{this.getMsg('form.inputs.acceleration.label')}</td>{
                                this.state.editions.map((edition) =>
                                        <td>{edition.acceleration}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>{this.getMsg('form.inputs.maxSpeed.label')}</td>{
                                this.state.editions.map((edition) =>
                                        <td>{edition.maxSpeed}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>{this.getMsg('form.inputs.gearboxType.label')}</td>{
                                this.state.editions.map((edition) =>
                                        <td>{getEnumLabel('gearboxTypes', edition.gearboxType)}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>{this.getMsg('form.inputs.gearboxLevels.label')}</td>{
                                this.state.editions.map((edition) =>
                                        <td>{edition.gearboxLevels}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>{this.getMsg('form.inputs.transmissionType.label')}</td>{
                                this.state.editions.map((edition) =>
                                        <td>{getEnumLabel('transmissionTypes', edition.transmissionType)}</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td></td>{
                                this.state.editions.map((edition) =>
                                    <td>
                                        <IconButton
                                            onClick={this.onEditClicked.bind(this, edition)}
                                            style={{padding: "0px", height: "auto"}}
                                            iconClassName="material-icons">mode_edit</IconButton>
                                    </td>
                                )
                            }
                        </tr>
                        <tr>
                            <td></td>{
                                this.state.editions.map((edition) =>
                                    <td>
                                        <IconButton
                                            onClick={this.onDeleteClicked.bind(this, edition)}
                                            style={{padding: "0px", height: "auto"}}
                                            iconClassName="material-icons">delete</IconButton>
                                    </td>
                                )
                            }
                        </tr>
                    </tbody>
                </table>{(() => {
                    if(_.isNull(this.state.editionInForm))
                        return (
                            <IconedButton
                                iconName="playlist_add"
                                label={this.getMsg('actions.add')}
                                onClick={this.onAddClicked}/>
                        );
                    else
                        return (
                            <EditionForm
                                editionId={this.state.editionInForm.id}
                                modelId={this.props.params.modelId}
                                onAfterSubmit={this.onItemSubmited}
                                onCancel={this.onFormCancel}/>
                        );
                })()
                }
                <ConfirmDialog
                    ref="deleteDialog"
                    onConfirm={this.onConfirmDelete}
                    onCancel={this.onCancelDelete}
                    msgKeyPrefix="controlPanel.models.editions.deleteDialog">
                    {this.getMsg('labels.deleteDialog.labels.dialogText')}
                </ConfirmDialog>
            </div>
        );
    },
    componentWillMount() {
        this.loadEditions();
    },
    loadEditions() {
        this.ajax(jsRoutes.controllers.Models.listModelEditions(this.props.params.modelId), {
            success: (editions) => this.setState({editions: editions})
        });
    },
    onAddClicked() {
        this.setState({editionInForm: {id: null}});
    },
    onEditClicked(edition) {
        this.setState({editionInForm: edition})
    },
    onDeleteClicked(edition) {
        this.setState({editionToDelete: edition});
        this.refs.deleteDialog.show();
    },
    onItemSubmited() {
        this.setState({editionInForm: null});
        this.loadEditions();
    },
    onFormCancel() {
        this.setState({editionInForm: null});
    },
    onConfirmDelete() {
        this.ajax(jsRoutes.controllers.Models.deleteEdition(this.state.editionToDelete.id), {
            complete: () => this.loadEditions()
        });
        this.setState({editionToDelete: null});
    },
    onCancelDelete() {
        this.setState({editionToDelete: null});
    }
});
