define(['react', 'intl-messageformat'], function(React) {

    function getNestedProperty(obj, prop) {
        try {
            return getNestedPropertyImpl(obj, prop);
        }
        catch(err) {
            if(err.name === 'TypeError') {
                console.warn('IntlMixin: failed to find message by key \"' + prop + '\"');
                console.warn('IntlMixin: Exception: ' + err.toString());
                return prop;
            }
            else {
                throw err;
            }
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
        }
    };

    return IntlMixin;
});