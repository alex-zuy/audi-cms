define(['react', 'allMixins', 'reactRouter',
    'js/components/models/ModelForm'
], function(React, allMixins, ReactRouter, ModelForm) {

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.model.update',
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
                    <hr/>

                </div>
            );
        },
        onSubmit() {
            this.refs.form.submitForm(jsRoutes.controllers.Models.updateModel(this.props.params.modelId), {
                complete: () => this.transitionTo('models-list')
            });
        }
    });
});
