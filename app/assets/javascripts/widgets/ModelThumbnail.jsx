define(['react', 'reactRouter', 'mui', 'allMixins'], function(React, ReactRouter, mui, allMixins) {

    const {Card, CardText, CardMedia, CardTitle, CardActions, FlatButton} = mui;

    return React.createClass({
        mixins: [
            allMixins.AjaxMixin,
            allMixins.IntlMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'components.ModelThumbnail'
            }
        },
        getInitialState() {
            return {
                model: null,
                modelRange: null,
                photo: null,
            };
        },
        render() {
            if(_.isNull(this.state.model)) {
                return <div/>;
            }
            else {
                return (
                    <a href={this.makeHref('model-detailed', {modelId: this.state.model.id})}>
                        <Card style={{marginBottom: '20px'}}>
                            <CardMedia>
                                <img src={jsRoutes.controllers.Photos.showImage(this.state.photo.id).url}/>
                            </CardMedia>
                            <CardTitle
                                title={this.getPreferedText(this.state.modelRange.name)}
                                subtitle={this.getPreferedText(this.state.model.name)}/>
                        </Card>
                    </a>
                );
            }
        },
        componentDidMount() {
            this.ajax(jsRoutes.controllers.Models.listModels(), {
                success: (models) => {
                    if(!_.isEmpty(models)) {
                        const model = _.chain(models).shuffle().first().value();
                        this.ajax(jsRoutes.controllers.Models.showRange(model.modelRangeId), {
                            success: (range) => {
                                this.ajax(jsRoutes.controllers.Photos.listPhoto(model.photoSetId), {
                                    success: (photos) => {
                                        if(!_.isEmpty(photos)) {
                                            const photo = _.chain(photos).shuffle().first().value();
                                            this.setState({
                                                model: model,
                                                modelRange: range,
                                                photo: photo
                                            });
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    });
});