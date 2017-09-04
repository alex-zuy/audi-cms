import React from 'react';
import IntlMessageFormat from 'intl-messageformat';
import jsCookie from 'js-cookie';

const currentLanguageCookieKey = 'lang';

function getNestedProperty(obj, prop) {
    try {
        const property = getNestedPropertyImpl(obj, prop);
        if(typeof property === 'string') {
            return property
        }
        else {
            throw new Error(`Key '${prop}' is not string`);
        }
    }
    catch(err) {
        console.log('IntlMixin: failed to find message by key \"' + prop + '\"');
        console.log('IntlMixin: Exception: ' + err.toString());
        return prop;
    }
}

function getNestedPropertyImpl(obj, prop) {
    var dotIndex = prop.indexOf(".");
    if(dotIndex > 0) {
        var outerProp = prop.slice(0, dotIndex);
        var innerProp = prop.substr(dotIndex + 1);
        return getNestedPropertyImpl(obj[outerProp], innerProp);
    }
    else {
        return obj[prop];
    }
}

var IntlMixin = {
    contextTypes: {
        locale: React.PropTypes.string.isRequired,
        messages: React.PropTypes.object.isRequired,
        defaultLanguage: React.PropTypes.string.isRequired,
        supportedLanguages: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    },
    getIntlMessage: function(key, args) {
        var msgFmt = new IntlMessageFormat(getNestedProperty(this.context.messages, key), this.context.locale);
        return msgFmt.format(args);
    },
    getMsg: function(relativeKey, args) {
        var key = (typeof this.props.msgKeyPrefix === 'undefined')
            ? (relativeKey)
            : (this.props.msgKeyPrefix + '.' + relativeKey);
        return this.getIntlMessage(key, args);
    },
    getPreferedText(texts) {
        if(_.isEmpty(texts[this.getCurrentLanguage()])) {
            return texts[this.context.defaultLanguage];
        }
        else {
            return texts[this.getCurrentLanguage()];
        }
    },
    getDefaultLanguage() {
        return this.context.defaultLanguage;
    },
    setCurrentLanguage(lang) {
        if(_.contains(this.context.supportedLanguages, lang)) {
            jsCookie.set(currentLanguageCookieKey, lang);
        }
        else {
            throw new Error(`Trying to set unsuported app language \"${lang}\"`);
        }
    },
    getCurrentLanguage() {
        return jsCookie.get(currentLanguageCookieKey);
    },
    getSupportedLanguages() {
        return this.context.supportedLanguages;
    }
};

export default IntlMixin;
