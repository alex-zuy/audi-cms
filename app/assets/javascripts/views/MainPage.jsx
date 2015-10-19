define(['react', 'allMixins',
    'javascripts/components/TodoDummy',
    'js/widgets/Article'
], function(React, allMixins, TodoDummy, Article) {

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
                    <div className="row">
                        <div className="col l2 red">
                        </div>
                        <div className="col l8 offset-l2">{
                                this.state.articles.map((a) =>
                                    <Article article={a}/>
                                )
                            }
                        </div>
                        <div className="col l2 offset-l10 yellow">
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
