define(['react', 'allMixins',
    'js/widgets/ModelThumbnail',
    'js/widgets/Article',
], function(React, allMixins, ModelThumbnail, Article) {

    var NewsAndOffersPage = React.createClass({
        mixins: [
            allMixins.AjaxMixin,
        ],
        getInitialState() {
            return {articles: []}
        },
        render: function() {
            return (
                <div>
                    <div className="row">
                        <div className="col l3 m3 hide-on-small-only">
                            <div style={{marginTop: '20px'}}>
                                <ModelThumbnail/>
                            </div>
                        </div>
                        <div className="col l9 m9">{
                            this.state.articles.map((a) =>
                                <Article article={a}/>
                            )
                        }
                        </div>
                    </div>
                </div>
            )
        },
        componentDidMount() {
            this.ajax(jsRoutes.controllers.Articles.list(), {
                success: (allArticles) => {
                    const articles = allArticles.filter((article) => _.contains(['news', 'offers'], article.category));
                    this.setState({articles: articles});
                }
            });
        }
    });

    return NewsAndOffersPage;
});
