define(['react', 'allMixins',
    'javascripts/components/TodoDummy',
    'js/widgets/ModelsCarousel',
    'js/widgets/ModelRanges',
    'js/widgets/ModelThumbnail',
    'js/widgets/Article'
], function(React, allMixins, TodoDummy, ModelsCarousel, ModelRanges, ModelThumbnail, Article) {

    var MainPage = React.createClass({
        mixins: [
            allMixins.AjaxMixin,
        ],
        getInitialState() {
            return {
                articles: [],
            }
        },
        render: function() {
            return (
                <div>
                    <div className="row" style={{marginBottom: '0px'}}>
                        <ModelRanges/>
                    </div>
                    <div className="row">
                        <ModelsCarousel/>
                    </div>
                    <div className="row">
                        <div className="col l3 m3 hide-on-small-only">
                            <div style={{marginTop: '20px'}}>
                                <ModelThumbnail/>
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
            );
        },
        componentDidMount() {
            this.ajax(jsRoutes.controllers.Articles.list(), {
                success: (articles) => this.setState({articles: articles})
            })
        }
    });

    return MainPage
});
