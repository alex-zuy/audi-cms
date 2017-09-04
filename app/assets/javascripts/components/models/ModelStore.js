import React from 'react';
import ReactRouter from 'react-router';
import allMixins from 'mixins/allMixins';
import ModelForm from 'components/models/ModelForm';

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        ReactRouter.Navigation,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.models.store'
        }
    },
    getInitialState() {
        return {
            photoSetId: null,
        }
    },
    render() {
        return (
            <div>
                <h4>{this.getMsg('labels.creatingModel')}</h4>
                <ModelForm
                    ref="form"
                    photoSetId={this.state.photoSetId}
                    onSubmit={this.onSubmit}/>
            </div>
        );
    },
    componentWillMount() {
        this.ajax(jsRoutes.controllers.Photos.storePhotoSet(), {
            success: (response) => this.setState({photoSetId: response.id})
        });
    },
    onSubmit() {
        this.refs.form.submitForm(jsRoutes.controllers.Models.storeModel(), {
            success: (response) => this.transitionTo('model-edit-menu', {modelId: response.id})
        });
    }
});
