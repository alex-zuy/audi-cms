define(['react', 'allMixins', 'js/inputs/TextInput'], function(React, allMixins, TextInput) {

    const RPT = React.PropTypes;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
        ],
        propTypes: {
            languages: RPT.arrayOf(RPT.string).isRequired,
            requiredLanguages: RPT.arrayOf(RPT.string).isRequired,
        },
        getDefaultProps() {
            return {
                msgKeyPrefix: 'components.I18nTextInput.labels'
            }
        },
        getInitialState() {
            return { errorText: '' };
        },
        render() {
            return (
                <div>{
                    _.isEmpty(this.state.errorText)
                        ? <div/>
                        : <div ref="errors" className="card-panel red lighten-1 white-text">{this.state.errorText}</div> }
                    { this.props.languages.map((lang) =>
                        <div>
                            <TextInput key={lang} ref={lang} floatingLabelText={this.getMsg(`languages.${lang}`)}/>
                            <br/>
                        </div>
                    )}
                </div>
            );
        },
        setValue(value) {
            _.keys(value).forEach((lang) => this.refs[lang].setValue(value[lang]));
        },
        getValue() {
            return this.props.languages.reduce((texts, lang) => {
                texts[lang] = this.refs[lang].getValue();
                return texts;
            }, {});
        },
        isEmpty() {
            return this.props.requiredLanguages.some((lang) => this.refs[lang].isEmpty());
        },
        setErrorText(errorText) {
            this.setState({errorText: errorText});
        }
    });
});
