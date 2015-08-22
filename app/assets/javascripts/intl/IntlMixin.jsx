define(['react', 'intl-messageformat'], function(React) {

    var IntlMixin = {
        contextTypes: {
            locale: React.PropTypes.string.isRequired,
            messages: React.PropTypes.object.isRequired,
        },
        getIntlMessage: function(key, args) {
            var msgFmt = new IntlMessageFormat(this.context.messages[key], this.context.locale);
            return msgFmt.format(args);
        }
    };

    return IntlMixin;
});
