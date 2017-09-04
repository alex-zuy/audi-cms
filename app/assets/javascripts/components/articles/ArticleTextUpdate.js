import React from 'react';
import reactRouter from 'react-router';
import allMixins from 'mixins/allMixins';
import mui from 'mui';
import ContentEditor from 'widgets/ContentEditor';

export default React.createClass({
    mixins: [
        allMixins.AjaxMixin,
        allMixins.IntlMixin,
        reactRouter.Navigation,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.articles',
        }
    },
    getInitialState() {
        return {
            article: {
                title: { en: ''},
                category: '',
                photoSetId: null,
                text: {},
            }
        }
    },
    render() {
        return (
            <div>
                <h4>{this.getMsg('labels.articleContentEditing')}</h4>
                <h5>{this.getMsg('labels.titleIs', {title: this.getPreferedText(this.state.article.title)})}</h5>
                <h6>{this.getMsg('labels.categoryIs', {category: this.state.article.category})}</h6>
                <ContentEditor
                    ref="editor"
                    onSave={this.onSave}
                    onCancel={this.afterDone}/>
            </div>
        );
    },
    componentDidMount() {
        const {id, lang} = this.props.params;
        this.ajax(jsRoutes.controllers.Articles.show(id), {
            success: (article) => {
                this.setState({article: article});
                this.refs.editor.setPhotoSetAndContent(article.photoSetId,
                    _.isUndefined(article.text[lang]) ? '' : article.text[lang]);
            }
        });
    },
    onSave() {
        const {id, lang} = this.props.params;
        this.ajax(jsRoutes.controllers.Articles.updateText(id), {
            data: {
                lang: lang,
                text: this.refs.editor.getContent(),
            },
            success: () => this.afterDone()
        });
    },
    afterDone() {
        this.transitionTo('article-update', {id: this.props.params.id});
    }
});
