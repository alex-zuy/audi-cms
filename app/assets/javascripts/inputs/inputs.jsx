define([
    'js/inputs/HiddenInput',
    'js/inputs/MapInput',
    'js/inputs/TextInput',
    'js/inputs/I18nTextInput',
    'js/inputs/TimestampNowInput',
    'js/inputs/SelectInput',
    'js/inputs/NumberInput'
], function(
    HiddenInput,
    MapInput,
    TextInput,
    I18nTextInput,
    TimestampNowInput,
    SelectInput,
    NumberInput
) {
    return {
        HiddenInput: HiddenInput,
        MapInput: MapInput,
        TextInput: TextInput,
        I18nTextInput: I18nTextInput,
        TimestampNowInput: TimestampNowInput,
        SelectInput: SelectInput,
        NumberInput: NumberInput
    };
});