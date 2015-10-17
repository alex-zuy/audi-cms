define(['react', 'allMixins', 'reactRouter',
    'js/widgets/IconedButton',
], function (React, allMixins, ReactRouter, IconedButton) {

    const {Link} = ReactRouter;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.models.list'
            }
        },
        getInitialState() {
            return {
                models: [],
            }
        },
        render() {
            return (
                <div>
                    <h4>{this.getMsg('labels.models')}</h4>
                    <div className="collection">{
                        this.state.models.map((model) =>
                            <Link className="collection-item" to="model-update" params={{modelId: model.id}}>
                                {this.getPreferedText(model.name)}
                            </Link>
                        )
                    }
                    </div>
                    <IconedButton
                        iconName="playlist_add"
                        label={this.getMsg('actions.add')}
                        href={this.makeHref('model-store')}
                        linkButton={true}/>
                </div>
            );
        },
        componentWillMount() {
            this.ajax(jsRoutes.controllers.Models.listModels(), {
                success: (models) => this.setState({models: models})
            });
        },
    });
});
