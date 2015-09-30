define([
    'react',
    'reactRouter',
    'allMixins',
    'mui',
    'js/components/ConfirmDialog',
    'js/widgets/IconedButton'],
    function(React, reactRouter, allMixins, mui, ConfirmDialog, IconedButton) {

    const {Paper, IconButton} = mui;

    return React.createClass({
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
                <Paper zDepth={4} rounded={false} style={{padding: '30px'}}>
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
                </Paper>
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
});
