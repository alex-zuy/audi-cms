define([
    'react',
    'reactRouter',
    'allMixins',
    'mui',
    'js/components/GenericForm',
    'js/widgets/IconedButton',
    'js/inputs/inputs'], function(React, reactRouter, allMixins, mui, GenericForm, IconedButton, inputs) {

    const {I18nTextInput, TextInput, TimestampNowInput, HiddenInput} = inputs;
    const {Paper, Tabs, Tab} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
            reactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.articles',
            };
        },
        getInitialState() {
            return {
                text: {},
                textTabLang: this.getDefaultLanguage(),
                photoSetId: null,
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
                            {ref: 'createdAt', editorComponent: TimestampNowInput, isRequired: true},
                            {ref: 'photoSetId', editorComponent: HiddenInput, isRequired: true, props: {value: this.state.photoSetId}}
                        ]}
                        msgKeyPrefix="controlPanel.articles.form"
                        validateRoute={() => jsRoutes.controllers.Articles.validateHeaders()}
                        onSubmitAttempt={this.onSubmit}/>
                    <hr/>
                    { this.isStore()
                        ? <div/>
                        : (
                        <div>
                            <IconedButton
                                onClick={this.gotoEditPhotoSet}
                                label={this.getMsg('actions.editPhotos')}
                                iconName='mode_edit'
                                disables={_.isNull(this.state.photoSetId)}
                                style={{margin: '20px 0px 10px 0px'}}/>
                            <br/>
                            <IconedButton
                                onClick={this.gotoEditText}
                                label={this.getMsg('actions.editText')}
                                iconName='mode_edit'
                                style={{margin: '20px 0px 10px 0px'}}/>
                            <Tabs
                                initialSelectedIndex={_.indexOf(this.getSupportedLanguages(), this.getDefaultLanguage())}
                                onChange={this.textTabChanged}>
                                { this.getSupportedLanguages().map((lang) =>
                                    <Tab value={lang} label={this.getIntlMessage(`generic.languages.${lang}`)}>
                                        { _.isUndefined(this.state.text[lang])
                                            ? ''
                                            : <div dangerouslySetInnerHTML={{__html: this.state.text[lang]}}/>
                                        }
                                    </Tab>
                                )}
                            </Tabs>
                        </div>
                    )}
                </Paper>
            );
        },
        componentDidMount() {
            if(this.isStore()) {
                this.ajax(jsRoutes.controllers.Photos.storePhotoSet(), {
                    success: (response) => this.setState({photoSetId: response.id})
                });
            }
            else {
                this.ajax(jsRoutes.controllers.Articles.show(this.props.params.id), {
                    success: (article) => {
                        this.refs.form.fillForm(article);
                        this.setState({text: article.text, photoSetId: article.photoSetId});
                    }
                });
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
        },
        textTabChanged(lang) {
            this.setState({textTabLang: lang});
        },
        gotoEditText() {
            this.transitionTo('article-text-update', {id: this.props.params.id, lang: this.state.textTabLang});
        },
        gotoEditPhotoSet() {
            this.transitionTo('photo-set-update', {id: this.state.photoSetId});
        }
    });
});
