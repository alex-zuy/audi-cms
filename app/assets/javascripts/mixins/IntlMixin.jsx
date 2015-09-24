define(['react', 'IntlMessageFormat'], function(React, IntlMessageFormat) {

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
            console.warn('IntlMixin: failed to find message by key \"' + prop + '\"');
            console.warn('IntlMixin: Exception: ' + err.toString());
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
            //TODO make this function more intelligent
            return texts.en;
        }
    };

    return IntlMixin;
});
