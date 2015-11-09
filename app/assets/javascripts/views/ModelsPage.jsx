define(['react', 'mui', 'allMixins', 'reactRouter',
    'js/widgets/ModelRanges',
], function(React, mui, allMixins, ReactRouter, ModelRanges) {

    const {Card, CardMedia, CardTitle} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
            ReactRouter.Navigation,
        ],
        getInitialState() {
            return {models:[]};
        },
        render: function() {
            return (
                <div>
                    <div className="row">
                        <ModelRanges/>
                    </div>
                    <div className="row">{
                        this.sortByRangeAndFilter().map(range =>
                            <div className="row">
                                <h4>{this.getPreferedText(range.range.name)}</h4>{
                                range.models.map(model =>
                                    <div className="col m4 l3">
                                        <a href={this.makeHref('model-detailed', {modelId: model.id})}>
                                            <Card style={{marginBottom: '20px'}}>
                                                <CardMedia>
                                                    <img src={jsRoutes.controllers.Photos.showImage(_.first(model.photos).id).url}/>
                                                </CardMedia>
                                                <CardTitle
                                                    title={this.getPreferedText(model.range.name)}
                                                    subtitle={this.getPreferedText(model.name)}/>
                                            </Card>
                                        </a>
                                    </div>
                                )
                            }
                            </div>
                        )
                    }
                    </div>
                </div>
            )
        },
        componentDidMount() {
            this.ajax(jsRoutes.controllers.Models.listModelsDetailed(), {
                success: (all) => this.setState({models: all})
            });
        },
        sortByRangeAndFilter() {
            const sortedByRange = _.chain(this.state.models)
                .groupBy(m => m.modelRangeId)
                .map(modelsInRange => ({
                    range: _.first(modelsInRange).range,
                    models: _.sortBy(modelsInRange, (model) => this.getPreferedText(model.name))
                }))
                .sortBy(group => this.getPreferedText(group.range.name))
                .value();
            if(_.isUndefined(this.props.query.modelRangeId)) {
                return sortedByRange;
            }
            else {
                return _.filter(sortedByRange, group => group.range.id == this.props.query.modelRangeId);
            }
        }
    });
});
