define(['react'], function(React) {

    /* Class-user of this mixin must mix in IntlMixin and AjaxMixin */

    return {
        propTypes: {
            formMixin: React.PropTypes.shape({
                fieldRefs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
                optionalFieldRefs: React.PropTypes.arrayOf(React.PropTypes.string),
                validateRoute: React.PropTypes.func.isRequired,
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
            setInterval(this._formPollingCallback.bind(this), 100);
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
            return this.getRequiredFieldRefs().every((fieldRef) => !this.refs[fieldRef].isEmpty());
        },
        validateForm() {
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
        loadItem(loadRoute, callback = _.noop) {
            this.ajax(loadRoute, { success: (item) => {this.fillForm(item); callback()} });
        },
        submitForm(route, callbacks) {
            if(this.state.formMixin.fieldsValid) {
                this.ajax(route, {
                    data: this.getAllFields(),
                    success: callbacks.success,
                    error: callbacks.error,
                    complete: callbacks.complete,
                });
            }
        },
        onFormChangeValidate() {
            this._lastChanged = new Date();
            this._wasValidated = false;
            if(!this.allRequiredFieldsNotEmpty()) {
                this.setState({formMixin: {fieldsValid: false}});
            }
        },
        _formPollingCallback() {
            var now = new Date();
            if(!this._wasValidated && now.getTime() - this._lastChanged.getTime() > this.props.formMixin.validateDelay) {
                this._wasValidated = true;
                this.validateForm();
            }
        },
        _lastChanged: null,
        _wasValidated: false,
    }
});
