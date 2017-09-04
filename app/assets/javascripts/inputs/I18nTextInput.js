import React from 'react';
import allMixins from 'mixins/allMixins';
import TextInput from 'inputs/TextInput';
import mui from 'mui';

const RPT = React.PropTypes;
const {Paper} = mui;

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
    ],
    contextTypes: {
        locale: React.PropTypes.string.isRequired,
        defaultLanguage: React.PropTypes.string.isRequired,
        supportedLanguages: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    },
    propTypes: {
        floatingLabelText: React.PropTypes.string.isRequired,
        hintText: React.PropTypes.string,
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
            <Paper zDepth={1} rounded={false} style={{padding: '20px'}}>
                {this.props.floatingLabelText}
                { _.isEmpty(this.state.errorText)
                    ? <div/>
                    : <div ref="errors" className="card-panel red lighten-1 white-text">{this.state.errorText}</div> }
                { this._getLanguages().map((lang) =>
                    <div>
                        <TextInput
                            key={lang}
                            ref={lang}
                            hintText={ _.isEmpty(this.props.hintText) ? '' : this.props.hintText }
                            floatingLabelText={this.getMsg(`languages.${lang}`)}/>
                        <br/>
                    </div>
                )}
            </Paper>
        );
    },
    setValue(value) {
        _.keys(value).forEach((lang) => this.refs[lang].setValue(value[lang]));
    },
    getValue() {
        return this._getLanguages().reduce((texts, lang) => {
            texts[lang] = this.refs[lang].getValue();
            return texts;
        }, {});
    },
    isEmpty() {
        return this._getRequiredLanguages().some((lang) => this.refs[lang].isEmpty());
    },
    setErrorText(errorText) {
        this.setState({errorText: errorText});
    },
    _getRequiredLanguages() { return [this.context.defaultLanguage]; },
    _getLanguages() { return this.context.supportedLanguages; },
});
