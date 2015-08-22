define(['react', 'intl-messageformat'], function(React) {

    function getNestedProperty(obj, prop) {
        var dotIndex = prop.indexOf(".");
        if(dotIndex > 0) {
            var outerProp = prop.slice(0, dotIndex);
            var innerProp = prop.substr(dotIndex + 1);
            return getNestedProperty(obj[outerProp], innerProp);
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
        }
    };

    return IntlMixin;
});
