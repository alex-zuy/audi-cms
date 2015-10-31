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
            const ranged = this.sortByRangeModel();
            return (
                <div>
                    <div className="row">
                        <ModelRanges/>
                    </div>
                    <div className="row">{
                        ranged.map(range =>
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
        sortByRangeModel() {
            return _.chain(this.state.models)
                .groupBy(m => m.modelRangeId)
                .map(modelsInRange => ({
                    range: modelsInRange[0].range,
                    models: _.sortBy(modelsInRange, (model) => this.getPreferedText(model.name))
                }))
                .sortBy(group => this.getPreferedText(group.range.name))
                .value();
        }
    });
});
