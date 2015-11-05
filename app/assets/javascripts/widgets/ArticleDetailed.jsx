define(['react', 'mui', 'allMixins',
    'js/widgets/PhotoSetView'
], function(React, mui, allMixins, PhotoSetView) {

    const {CircularProgress, Card, CardTitle, CardMedia, Paper} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
        ],
        propTypes: {
            params: React.PropTypes.shape({
                articleId: React.PropTypes.number.isRequired,
            })
        },
        getDefaultState() {
            return {
                msgKeyPrefix: ''
            }
        },
        getInitialState() {
            return {
                article: null,
            }
        },
        render() {
            return (
                <div>{(() => {
                    if(_.isNull(this.state.article)) {
                        return <CircularProgress/>
                    }
                    else {
                        return (
                            <div className="z-depth-1">
                                <PhotoSetView photoSetId={this.state.article.photoSetId}/>
                                <div style={{padding: '15px'}}>
                                    <h5>{this.getPreferedText(this.state.article.title)}</h5>
                                    <div dangerouslySetInnerHTML={{__html: this.getPreferedText(this.state.article.text)}}/>
                                </div>
                            </div>
                        );
                    }
                })()}
                </div>
            );
        },
        componentDidMount() {
            this.ajax(jsRoutes.controllers.Articles.show(this.props.params.articleId), {
                success: (article) => this.setState({article: article})
            })
        },
    });
});
