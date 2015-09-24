define([
    'js/inputs/HiddenInput',
    'js/inputs/MapInput',
    'js/inputs/TextInput',
    'js/inputs/I18nTextInput',
], function(
    HiddenInput,
    MapInput,
    TextInput,
    I18nTextInput
) {
    return {
        HiddenInput: HiddenInput,
        MapInput: MapInput,
        TextInput: TextInput,
        I18nTextInput: I18nTextInput,
    };
});