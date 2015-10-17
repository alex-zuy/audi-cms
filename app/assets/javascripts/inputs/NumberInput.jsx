define(['react', 'mui', 'allMixins'], function (React, mui, allMixins) {

    const {TextField} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
        ],
        propTypes: {
            integerOnly: React.PropTypes.bool,
        },
        getDefaultProps() {
            return {
                integerOnly: false,
                defaultValue: null,
                msgKeyPrefix: 'components.NumberInput'
            }
        },
        getInitialState() {
            return {
                value: this.props.defaultValue,
                errorText: null,
            }
        },
        render() {
            return (
                <TextField
                    ref="field"
                    errorText={this.state.errorText}
                    onChange={this.onChange}
                    {...this.props}/>
            );
        },
        onChange(e) {
            const {value} = e.target;
            if(_.isEmpty(value)) {
                this.setState({value: null, errorText: null});
            }
            else if(this._isValidValue(value)) {
                this.setState({value: value, errorText: null});
            }
            else {
                this.setState({value: null, errorText: this.getErrorText()});
            }
        },
        getErrorText() {
            return this.props.integerOnly ? this.getMsg('errors.integerOnly') : this.getMsg('errors.numberOnly');
        },
        isEmpty() {
            return _.isNull(this.state.value);
        },
        setValue(value) {
            if(this._isValidValue(value)) {
                this.setState({value: value});
                this.refs.field.setValue(value);
            }
        },
        getValue() {
            if(this.isEmpty()) {
                return null;
            }
            else if(this.props.integerOnly) {
                return parseInt(this.state.value);
            }
            else {
                return parseFloat(this.state.value);
            }
        },
        setErrorText(text) {
            this.setState({errorText: text});
        },
        _isValidValue(value) {
            return (this.props.integerOnly && isInteger(value)) || (!this.props.integerOnly && isFloat(value));
        },
    });

    function isInteger(value) {
        return /^\d+$/.test(value);//!_.isNaN(parseInt(value));
    }

    function isFloat(value) {
        return /^\d+(\.\d+)?$/.test(value);//!_.isNaN(parseFloat(value));
    }
});
