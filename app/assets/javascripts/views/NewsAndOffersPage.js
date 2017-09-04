import React from 'react';
import allMixins from 'mixins/allMixins';
import ReactRouter from 'react-router';
import ModelThumbnail from 'widgets/ModelThumbnail';
import Article from 'widgets/Article';

const {Link} = ReactRouter;

var NewsAndOffersPage = React.createClass({
    mixins: [
        allMixins.AjaxMixin,
        allMixins.IntlMixin,
    ],
    getDefaultProps() {
        return {categories:['news', 'offers']};
    },
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
                        <div>
                            <ul className="section table-of-contents">{
                                this.props.categories.map((category) =>
                                    <li>
                                        <Link to="/news-and-offers" query={{categories:[category]}}>
                                            {this.getIntlMessage(`generic.articleCategories.${category}`)}
                                        </Link>
                                    </li>
                                )
                            }
                            </ul>
                        </div>
                    </div>
                    <div className="col l9 m9">{
                        this.getFilteredArticles().map((a) =>
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
            success: (all) => this.setState({articles: all})
        });
    },
    getFilteredArticles() {
        const categories = _.isUndefined(this.props.query.categories)
            ? this.props.categories
            : this.props.query.categories;
        return this.state.articles.filter((article) => _.contains(categories, article.category));
    }
});

export default NewsAndOffersPage;
