import React from 'react';
import allMixins from 'mixins/allMixins';
import mui from 'mui';
import GenericForm from 'components/GenericForm';
import inputs from 'inputs/inputs';

const {HiddenInput, TextInput, I18nTextInput, SelectInput, NumberInput} = inputs;

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
    ],
    propTypes: {
        modelId: React.PropTypes.number,
        photoSetId: React.PropTypes.number.isRequired,
        onSubmit: React.PropTypes.func.isRequired,
    },
    getDefaultProps() {
        return {
            modelId: null,
            photoSetId: null,
        }
    },
    getInitialState() {
        return {
            modelRanges: [],
            photoSetId: this.props.photoSetId,
        }
    },
    render() {
        return (
            <GenericForm
                ref="form"
                fields={this._getFormProps()}
                validateRoute={() => jsRoutes.controllers.Models.validateModel()}
                msgKeyPrefix="controlPanel.models.models"
                onSubmitAttempt={this.props.onSubmit}/>
        );
    },
    componentDidMount() {
        this.ajax(jsRoutes.controllers.Models.listRanges(), {
            success: (ranges) => this.setState({modelRanges: ranges})
        });
        if(!_.isNull(this.props.modelId)) {
            this.ajax(jsRoutes.controllers.Models.showModel(this.props.modelId), {
                success: (model) => {
                    this.setState({photoSetId: model.photoSetId});
                    this.refs.form.fillForm(model);
                }
            });
        }
    },
    componentWillReceiveProps(props) {
        if(!_.isUndefined(props.photoSetId)) {
            this.setState({photoSetId: props.photoSetId});
        }
    },
    submitForm(...a) {
        this.refs.form.submitForm(...a);
    },
    _getFormProps() {
        const rangeAlternatives = this.state.modelRanges.map((range) => ({
            label: this.getPreferedText(range.name),
            value: range.id
        }));

        return [
            {ref: 'id', editorComponent: HiddenInput, isRequired: false, props: {
                value: parseInt(this.props.modelId),
            }},
            {ref: 'modelRangeId', editorComponent: SelectInput, isRequired: true, props: {
                alternatives: rangeAlternatives,
                initiallyUnselected: false,
            }},
            {ref: 'photoSetId', editorComponent: HiddenInput, isRequired: true, props: {
                value: this.state.photoSetId,
            }},
            {ref: 'name', editorComponent: I18nTextInput, isRequired: true},
            {ref: 'passengerCapacity', editorComponent: NumberInput, isRequired: true, props:{
                integerOnly: true,
            }},
            {ref: 'width', editorComponent: NumberInput, isRequired: true},
            {ref: 'height', editorComponent: NumberInput, isRequired: true},
            {ref: 'length', editorComponent: NumberInput, isRequired: true},
            {ref: 'groundClearance', editorComponent: NumberInput, isRequired: true},
            {ref: 'luggageSpace', editorComponent: NumberInput, isRequired: true}
        ];
    }
});
