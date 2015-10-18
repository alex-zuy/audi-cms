define(['react', 'allMixins', 'reactRouter',
    'js/components/photos/PhotoSet',
    'js/widgets/IconedButton'
], function(React, allMixins, ReactRouter, PhotoSet, IconedButton) {

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.models.updatePhotos'
            }
        },
        getInitialState() {
            return {
                model: null,
            }
        },
        render() {
            return (
                <div>
                    <h4>{this.getMsg('labels.photos')}</h4>
                    <IconedButton
                        iconName="arrow_back"
                        label={this.getMsg('labels.backToEditMenu')}
                        linkButton={true}
                        href={this.makeHref('model-edit-menu', {modelId: this.props.params.modelId})}/>{(() => {

                        if(_.isNull(this.state.model))
                            return <div/>;
                        else
                            return <PhotoSet photoSetId={this.state.model.photoSetId}/>;
                    })()
                    }
                </div>
            );
        },
        componentDidMount() {
            this.ajax(jsRoutes.controllers.Models.showModel(this.props.params.modelId), {
                success: (model) => this.setState({model: model})
            });
        }
    });
});
