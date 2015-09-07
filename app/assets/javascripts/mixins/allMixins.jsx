define([
    'javascripts/mixins/AjaxMixin',
    'javascripts/mixins/FormMixin',
    'javascripts/mixins/IntlMixin'],
    function(AjaxMixin,
             FormMixin,
             IntlMixin) {

    /* Convenience module to load all mixins at once */

    return {
        AjaxMixin: AjaxMixin,
        FormMixin: FormMixin,
        IntlMixin: IntlMixin,
    };
});
