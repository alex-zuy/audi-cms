define([
    'react',
    'reactRouter',
    'allMixins',
    'mui',
    'js/components/GenericForm',
    'js/inputs/inputs'], function(React, reactRouter, allMixins, mui, GenericForm, inputs) {

    const {I18nTextInput, TextInput, TimestampNowInput} = inputs;
    const {Paper} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            reactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.articles',
            };
        },
        render() {
            return (
                <Paper zDepth={4} rounded={false} style={{padding: '30px'}}>
                    <h4>{this.getMsg('labels.article')}</h4>
                    <GenericForm
                        ref="form"
                        fields={[
                            {ref: 'title', editorComponent: I18nTextInput, isRequired: true},
                            {ref: 'category', editorComponent: TextInput, isRequired: true},
                            {ref: 'createdAt', editorComponent: TimestampNowInput, isRequired: true}
                        ]}
                        msgKeyPrefix="controlPanel.articles.form"
                        validateRoute={() => jsRoutes.controllers.Articles.validateHeaders()}
                        onSubmitAttempt={this.onSubmit}/>
                </Paper>
            );
        },
        componentDidMount() {
            if(!this.isStore()) {
                this.refs.form.loadItem(jsRoutes.controllers.Articles.show(this.props.params.id));
            }
        },
        onSubmit() {
            const route = this.isStore()
                ? jsRoutes.controllers.Articles.storeHeaders()
                : jsRoutes.controllers.Articles.updateHeaders(this.props.params.id);
            this.refs.form.submitForm(route, {
                success: () => this.transitionTo('articles-list'),
            });
        },
        isStore() {
            return _.isUndefined(this.props.params.id);
        }
    });
});
