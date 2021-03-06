import React from 'react';
import allMixins from 'mixins/allMixins';
import TodoDummy from 'components/TodoDummy';
import ModelsCarousel from 'widgets/ModelsCarousel';
import ModelRanges from 'widgets/ModelRanges';
import ModelThumbnail from 'widgets/ModelThumbnail';
import Article from 'widgets/Article';

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

export default MainPage
