import React from 'react';
import allMixins from 'mixins/allMixins';
import mui from 'mui';
import ReactRouter from 'react-router';

const {CircularProgress, Card, CardMedia, CardTitle} = mui;
const {RouteHandler, Navigation} = ReactRouter;

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        Navigation,
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
                <RouteHandler/>
                <hr/>
                <div>{(() => {
                    if(_.isNull(this.state.articles)) {
                        return <CircularProgress/>;
                    }
                    else {
                        return (
                            <div className="row">{_.shuffle(this.getServiceArticles()).map(article =>
                                <div className="col l4 m6">
                                    <a href={this.makeHref('service-terms-article', {articleId: article.id})}>
                                        <Card>
                                            <CardMedia
                                                overlay={<CardTitle title={this.getPreferedText(article.title)}/>}>
                                                <img src={PUBLIC_URL + jsRoutes.controllers.Photos.showImage(_.first(_.shuffle(article.photos)).id).url}/>
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
