define([
    'javascripts/mixins/AjaxMixin',
    'javascripts/mixins/DelayedFormValidateMixin',
    'javascripts/mixins/FormMixin',
    'intl-mixin'],
    function(AjaxMixin,
             DelayedFormValidateMixin,
             FormMixin,
             IntlMixin) {

    /* Convenience module to load all mixins at once */

    return {
        AjaxMixin: AjaxMixin,
        DelayedFormValidateMixin: DelayedFormValidateMixin,
        FormMixin: FormMixin,
        IntlMixin: IntlMixin,
    };
});
