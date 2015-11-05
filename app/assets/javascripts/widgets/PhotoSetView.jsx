define(['react', 'mui', 'allMixins'], function(React, mui, allMixins) {

    const {CircularProgress, Card, CardMedia, CardTitle} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
        ],
        propTypes: {
            photoSetId: React.PropTypes.number.isRequired,
        },
        getInitialState() {
            return {
                photos: null,
                currentPhoto: null,
            };
        },
        render() {
            return (
                <div>{(() => {
                    if(_.isNull(this.state.photos)) {
                        return <CircularProgress/>;
                    }
                    else if(_.isEmpty(this.state.photos)) {
                        return <div></div>;
                    }
                    else {
                        return (
                            <div className="z-depth-1" style={{padding: '20px'}}>
                                <div className="row">
                                    <Card>
                                        <CardMedia
                                            overlay={<CardTitle title={this.getPreferedText(this.state.currentPhoto.name)}/>}>
                                            <img
                                                src={jsRoutes.controllers.Photos.showImage(this.state.currentPhoto.id).url}
                                                style={{width: '99%'}}/>
                                        </CardMedia>
                                    </Card>
                                </div>
                                <div className="row" onClick={this.preventLinkDefault}>{ this.state.photos.map(photo =>
                                    <div className="col l2 m3 s6">
                                        <a href="" onClick={this.switchToPhoto.bind(this, photo)}>
                                            <img
                                                src={jsRoutes.controllers.Photos.showImage(photo.id).url}
                                                style={{width: '99%'}}/>
                                        </a>
                                    </div>
                                )}
                                </div>
                            </div>
                        );
                    }
                })()}
                </div>
            );
        },
        componentDidMount() {
            this.ajax(jsRoutes.controllers.Photos.listPhoto(this.props.photoSetId), {
                success: (all) => this.setState({
                    photos: all,
                    currentPhoto: _.first(all),
                })
            })
        },
        switchToPhoto(photo) {
            this.setState({currentPhoto: photo});
        },
        preventLinkDefault(e) {
            e.preventDefault();
        }

    });
});
