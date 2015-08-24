define(['react'], function(React) {

    function objectEmpty(obj) {
        return Object.getOwnPropertyNames(obj).length === 0;
    }

    /* Class-user of this mixin must mix in IntlMixin and AjaxMixin */

    return {
        propTypes: {
            formMixin: React.PropTypes.shape({
                fieldRefs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
                optionalFieldRefs: React.PropTypes.arrayOf(React.PropTypes.string),
                validateRoute: React.PropTypes.shape({
                    type: React.PropTypes.string,
                    url: React.PropTypes.string,
                }).isRequired,
                submitRoute: React.PropTypes.shape({
                    type: React.PropTypes.string,
                    url: React.PropTypes.string,
                }).isRequired,
            }).isRequired
        },
        getInitialState: function() {
            return {
                formMixin: {
                    fieldsValid: false,
                }
            }
        },
        getRequiredFieldRefs: function() {
            return (typeof this.props.formMixin.optionalFieldRefs !== 'undefined')
                ? (this.props.formMixin.fieldRefs.filter(function(fieldName) {
                    return this.props.formMixin.optionalFieldRefs.indexOf(fieldName) < 0;
                    }.bind(this)))
                : (this.props.formMixin.fieldRefs);
        },
        getAllFields: function() {
            return this.props.formMixin.fieldRefs.reduce(function(fields, fieldRef) {
                fields[fieldRef] = this.refs[fieldRef].getValue();
                return fields;
            }.bind(this), {});
        },
        allRequiredFieldsNotEmpty: function() {
            var allFields = this.getAllFields();
            return this.getRequiredFieldRefs().every(function(fieldName) {
                return allFields[fieldName].length !== 0;
            }.bind(this));
        },
        validateForm: function() {
            if (this.allRequiredFieldsNotEmpty()) {
                this.ajax(this.props.formMixin.validateRoute, {
                    data: this.getAllFields(),
                    success: function(violations) {
                        this.setState({formMixin: {fieldsValid: objectEmpty(violations)}});
                        Object.getOwnPropertyNames(violations).forEach(function(field) {
                            this.refs[field].setErrorText(this.getIntlMessage(violations[field].key, violations[field].args));
                        }, this);
                    }.bind(this)
                })
            }
        },
        submitForm: function(callbacks) {
            if(this.state.formMixin.fieldsValid) {
                this.ajax(this.props.formMixin.submitRoute, {
                    data: this.getAllFields(),
                    success: callbacks.success,
                    error: callbacks.error,
                    complete: callbacks.complete,
                });
            }
        }
    }
});
