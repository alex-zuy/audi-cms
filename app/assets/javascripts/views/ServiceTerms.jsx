define(['react', 'allMixins', 'mui'], function (React, allMixins, mui) {

    const {CircularProgress, Card, CardMedia, CardTitle} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'servicePage',
            };
        },
        getInitialState() {
            return {
                articles: null,
            };
        },
        render() {
            return (
                <div>
                    <h1>{this.getMsg('labels.termsOfService')}</h1>
                    <div>{(() => {
                        if(_.isNull(this.state.articles)) {
                            return <CircularProgress/>;
                        }
                        else {
                            return (
                                <div className="row">{_.shuffle(this.getServiceArticles()).map(article =>
                                    <div className="col l4 m6">
                                        <a href="">
                                            <Card>
                                                <CardMedia
                                                    overlay={<CardTitle title={this.getPreferedText(article.title)}/>}>
                                                    <img src={jsRoutes.controllers.Photos.showImage(_.first(_.shuffle(article.photos)).id).url}/>
                                                </CardMedia>
                                            </Card>
                                        </a>
                                    </div>
                                )}
                                </div>
                            );
                        }
                    })()}
                    </div>
                </div>
            );
        },
        componentDidMount() {
            this.ajax(jsRoutes.controllers.Articles.list(), {
                success: (all) => this.setState({articles: all})
            });
        },
        getServiceArticles() {
            return _.where(this.state.articles, {category: 'service'});
        }
    });
});
