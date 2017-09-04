import React from 'react';
import allMixins from 'mixins/allMixins';
import ReactRouter from 'react-router';
import PhotoSet from 'components/photos/PhotoSet';
import IconedButton from 'widgets/IconedButton';

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        ReactRouter.Navigation,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.articles'
        }
    },
    getInitialState() {
        return {
            article: null,
        }
    },
    render() {
        return (
            <div>
                <h4>{this.getMsg('labels.articlePhotos')}</h4>
                <IconedButton
                    iconName="arrow_back"
                    label={this.getMsg('labels.backToArticleForm')}
                    linkButton={true}
                    href={this.makeHref('article-update', {id: this.props.params.id})}/>{(() => {

                if(_.isNull(this.state.article))
                    return <div/>;
                else
                    return <PhotoSet photoSetId={this.state.article.photoSetId}/>;
            })()
            }
            </div>
        );
    },
    componentDidMount() {
        this.ajax(jsRoutes.controllers.Articles.show(this.props.params.id), {
            success: (article) => this.setState({article: article})
        });
    }
});
