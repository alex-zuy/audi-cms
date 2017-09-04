import React from 'react';
import allMixins from 'mixins/allMixins';
import ReactRouter from 'react-router';
import ModelForm from 'components/models/ModelForm';
import ModelEditionsFillForm from 'components/models/ModelEditionsFillForm';

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        ReactRouter.Navigation,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.models.update',
        }
    },
    render() {
        return (
            <div>
                <h4>{this.getMsg('labels.updatingModel')}</h4>
                <ModelForm
                    ref="form"
                    modelId={this.props.params.modelId}
                    onSubmit={this.onSubmit}/>
            </div>
        );
    },
    onSubmit() {
        this.refs.form.submitForm(jsRoutes.controllers.Models.updateModel(this.props.params.modelId), {
            complete: () => this.transitionTo('model-edit-menu', {modelId: this.props.params.modelId})
        });
    }
});
