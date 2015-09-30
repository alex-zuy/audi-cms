define([
    'js/inputs/HiddenInput',
    'js/inputs/MapInput',
    'js/inputs/TextInput',
    'js/inputs/I18nTextInput',
    'js/inputs/TimestampNowInput',
], function(
    HiddenInput,
    MapInput,
    TextInput,
    I18nTextInput,
    TimestampNowInput
) {
    return {
        HiddenInput: HiddenInput,
        MapInput: MapInput,
        TextInput: TextInput,
        I18nTextInput: I18nTextInput,
        TimestampNowInput: TimestampNowInput,
    };
});