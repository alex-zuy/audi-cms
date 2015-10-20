define(['react', 'reactRouter', 'mui', 'allMixins',
], function(React, ReactRouter, mui, allMixins) {

    const {Card, CardTitle, CardMedia} = mui;
    const {CSSTransitionGroup} = React.addons;

    return React.createClass({
        mixins: [
            allMixins.AjaxMixin,
            allMixins.IntlMixin,
        ],
        getDefaultProps() {
            return {switchInterval: 5000};
        },
        getInitialState() {
            return {
                models: [],
                currentModelIndex: null,
                currentModelPhoto: null,
                timeoutId: null,
            }
        },
        render() {
            return (
                <div>
                    <div className="carousel-container">
                        <CSSTransitionGroup
                            transitionName="model-carousel"
                            transitionAppear={true}
                            transitionEnterTimeout={5000}
                            transitionLeaveTimeout={5000}>{(() => {
                            if(_.isNull(this.state.currentModelIndex)) {
                                return <div key="initialDiv"/>;
                            }
                            else {
                                const model = this.state.models[this.state.currentModelIndex];
                                const photo = this.state.currentModelPhoto;
                                return (
                                    <Card key={`key-${model.id}-${photo.id}`} style={{float: 'left'}}>
                                        <CardMedia
                                            overlay={
                                                <CardTitle
                                                    title={this.getPreferedText(model.name)}
                                                    subtitle={this.getPreferedText(photo.name)}/>}>
                                            <img src={jsRoutes.controllers.Photos.showImage(photo.id).url}/>
                                        </CardMedia>
                                    </Card>
                                );
                            }
                        })()}
                        </CSSTransitionGroup>
                    </div>
                </div>
            );
        },
        componentDidMount() {
            this.ajax(jsRoutes.controllers.Models.listModels(), {
                success: (models) => {
                    if(!_.isEmpty(models)) {
                        var switchCards = () => {
                            this.setState({timeoutId: null});
                            const oldModelIndex = _.isNull(this.state.currentModelIndex)
                                ? 0 : this.state.currentModelIndex;
                            const modelIndex = (oldModelIndex + 1) % models.length;
                            const photoSetId = models[modelIndex].photoSetId;
                            this.ajax(jsRoutes.controllers.Photos.listPhoto(photoSetId), {
                                success: (photos) => {
                                    if (_.isEmpty(photos)) {
                                        this.setState({timeoutId: setTimeout(switchCards, 0)});
                                    }
                                    else {
                                        const photo = _.chain(photos).shuffle().first().value();
                                        this.setState({
                                            currentModelIndex: modelIndex,
                                            currentModelPhoto: photo,
                                            timeoutId: setTimeout(switchCards, this.props.switchInterval)
                                        });
                                    }
                                }
                            });
                        };
                        switchCards();
                        this.setState({models: models});
                    }
                }
            });
        },
        componentWillUnmount() {
            if(!_.isNull(this.state.timeoutId)) {
                clearTimeout(this.state.timeoutId);
            }
        }
    });
});
