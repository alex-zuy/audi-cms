define(['react', 'mui', 'allMixins',
    'js/widgets/ModelRanges',
], function(React, mui, allMixins, ModelRanges) {

    const {Card, CardMedia, CardTitle} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin
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
                                        <Card>
                                            <CardMedia>
                                                <img src={jsRoutes.controllers.Photos.showImage(model.photos[0].id).url}/>
                                            </CardMedia>
                                            <CardTitle title={this.getPreferedText(model.name)} style={{padding: '6px'}}/>
                                        </Card>
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
