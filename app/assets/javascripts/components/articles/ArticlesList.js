import React from 'react';
import reactRouter from 'react-router';
import allMixins from 'mixins/allMixins';
import mui from 'mui';
import ConfirmDialog from 'components/ConfirmDialog';
import IconedButton from 'widgets/IconedButton';

const {IconButton} = mui;

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        reactRouter.Navigation,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.articles',
        }
    },
    getInitialState() {
        return {
            articles: [],
            articleToDelete: null,
        }
    },
    render() {
        return (
            <div>
                <h4>{this.getMsg('labels.articles')}</h4>
                <IconedButton
                    linkButton={true}
                    href={this.makeHref('article-store')}
                    label={this.getMsg('actions.addArticle')}
                    iconName='playlist_add'/>
                <table>
                    <thead>
                        <tr>
                            <th>{this.getMsg('labels.title')}</th>
                            <th>{this.getMsg('labels.category')}</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>{
                        this.state.articles.map((article) =>
                            <tr key={`row-${article.id}`}>
                                <td>{this.getPreferedText(article.title)}</td>
                                <td>{article.category}</td>
                                <td>
                                    <IconButton
                                        onClick={this.gotoEdit.bind(this, article)}
                                        style={{padding: "0px", height: "auto"}}
                                        iconClassName="material-icons">mode_edit</IconButton>
                                </td>
                                <td>
                                    <IconButton
                                        onClick={this.attemptDelete.bind(this, article)}
                                        style={{padding: "0px", height: "auto"}}
                                        iconClassName="material-icons">delete</IconButton>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
                <ConfirmDialog
                    ref="deleteDialog"
                    onConfirm={this.confirmDelete}
                    onCancel={this.cancelDelete}
                    title={this.getMsg('labels.delete.dialogTitle')}>
                    {this.getMsg('labels.delete.dialog')}
                </ConfirmDialog>
            </div>
        );
    },
    componentWillMount() {
        this.loadArticles();
    },
    loadArticles() {
        this.ajax(jsRoutes.controllers.Articles.list(), {
            success: (articles) => this.setState({articles: articles}),
        });
    },
    gotoEdit(article) {
        this.transitionTo('article-update', {id: article.id});
    },
    attemptDelete(article) {
        this.setState({articleToDelete: article});
        this.refs.deleteDialog.show();
    },
    confirmDelete() {
        this.ajax(jsRoutes.controllers.Articles.delete(this.state.articleToDelete.id), {
            complete: () => this.loadArticles(),
        });
    },
    cancelDelete() {
        this.setState({articleToDelete: null});
    }
});
