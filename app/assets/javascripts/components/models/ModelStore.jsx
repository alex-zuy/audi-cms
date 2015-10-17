define(['react', 'reactRouter', 'allMixins',
    'js/components/models/ModelForm'
], function(React, ReactRouter, allMixins, ModelForm) {

    return React.createClass({
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
                success: (response) => this.transitionTo('model-update', {modelId: response.id})
            });
        }
    });
});
