define(['react'], function(React) {

    /* Class-user of this mixin must mix in IntlMixin and AjaxMixin */

    return {
        propTypes: {
            formMixin: React.PropTypes.shape({
                fieldRefs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
                optionalFieldRefs: React.PropTypes.arrayOf(React.PropTypes.string),
                validateRoute: React.PropTypes.func.isRequired,
                submitRoute: React.PropTypes.func.isRequired,
                validateDelay: React.PropTypes.number.isRequired,
            }).isRequired
        },
        getInitialState: function() {
            return {
                formMixin: {
                    fieldsValid: false,
                }
            }
        },
        componentDidMount() {
            this._lastChanged = new Date();
            setInterval(function() {
                var now = new Date();
                if(!this._wasValidated && now.getTime() - this._lastChanged.getTime() > this.props.formMixin.validateDelay) {
                    this._wasValidated = true;
                    this.validateForm();
                }
            }.bind(this), 100);
        },
        getRequiredFieldRefs() {
            const {fieldRefs: fields, optionalFieldRefs: optFields} = this.props.formMixin;
            return _.difference(fields, optFields);
        },
        getAllFields() {
            return _.reduce(this.props.formMixin.fieldRefs, (result, fieldRef) => {
                result[fieldRef] = this.refs[fieldRef].getValue();
                return result;
            }, {});
        },
        allRequiredFieldsNotEmpty() {
            const allFields = this.getAllFields();
            return this.getRequiredFieldRefs().every((fieldName) => !allFields[fieldName].isEmpty());
        },
        validateForm: function() {
            if (this.allRequiredFieldsNotEmpty()) {
                this.ajax(this.props.formMixin.validateRoute.apply(this), {
                    data: this.getAllFields(),
                    success: function(violations) {
                        this.setState({formMixin: {fieldsValid: _.isEmpty(violations)}});
                        _.keys(violations).forEach((field) => {
                            this.refs[field].setErrorText(this.getIntlMessage(violations[field].key, violations[field].args));
                        });
                    }.bind(this)
                })
            }
            else {
                this.setState({formMixin: {fieldsValid: false}});
            }
        },
        fillForm(model) {
            this.props.formMixin.fieldRefs.forEach((field) => this.refs[field].setValue(model[field]));
        },
        submitForm: function(callbacks) {
            if(this.state.formMixin.fieldsValid) {
                this.ajax(this.props.formMixin.submitRoute.apply(this), {
                    data: this.getAllFields(),
                    success: callbacks.success,
                    error: callbacks.error,
                    complete: callbacks.complete,
                });
            }
        },
        _lastChanged: null,
        _wasValidated: false,
        onFormChange() {
            this._lastChanged = new Date();
            this._wasValidated = false;
            if(!this.allRequiredFieldsNotEmpty()) {
                this.setState({formMixin: {fieldsValid: false}});
            }
        },
    }
});
