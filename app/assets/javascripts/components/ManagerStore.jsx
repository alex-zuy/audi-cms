define(['react', 'react-router', 'intl-mixin', 'javascripts/components/ErrorPanel', 'mui'], function(React, ReactRouter, IntlMixin, ErrorPanel, mui) {

    var TextField = mui.TextField;
    var RaisedButton = mui.RaisedButton;
    var Paper = mui.Paper;

    return React.createClass({
        mixins: [
            ReactRouter.Navigation,
            IntlMixin,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'managersCtl.store',
            }
        },
        getInitialState: function() {
            return {
                error: null,
                buttonDisabled: true,
            };
        },
        render: function() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "50px"}}>
                    <h5>{this.getMsg('labels.title')}</h5>
                    <form onChange={this.onChange}>
                        <ErrorPanel errorKey={this.state.error}/>
                        <TextField
                            ref="fullName"
                            floatingLabelText={this.getMsg('inputs.fullName.label')}
                            hintText={this.getMsg('inputs.fullName.placeholder')}
                            /><br/>
                        <TextField
                            ref="email"
                            floatingLabelText={this.getMsg('inputs.email.label')}
                            hintText={this.getMsg('inputs.email.placeholder')}
                            /><br/>
                        <TextField
                            ref="password"
                            onChange={this.clearConfirmPassword}
                            floatingLabelText={this.getMsg('inputs.password.label')}
                            hintText={this.getMsg('inputs.password.placeholder')}
                            type="password"
                            /><br/>
                        <TextField
                            ref="confirmPassword"
                            onBlur={this.onConfirmPasswordBlur}
                            floatingLabelText={this.getMsg('inputs.confirmPassword.label')}
                            hintText={this.getMsg('inputs.confirmPassword.placeholder')}
                            type="password"
                            /><br/>
                        <RaisedButton
                            onClick={this.submitStore}
                            label={this.getMsg('actions.store')}
                            disabled={this.state.buttonDisabled}
                            primary={true}
                            />
                    </form>
                </Paper>
            );
        },
        clearConfirmPassword: function() {
            this.refs.confirmPassword.clearValue();
        },
        onConfirmPasswordBlur: function() {
            if(!this.passwordsMatch()) {
                this.refs.confirmPassword.setErrorText(this.getMsg('errors.passwordsNotEqual'));
            }
        },
        passwordsMatch: function() {
            return this.refs.password.getValue() === this.refs.confirmPassword.getValue();
        },
        getAllFields: function() {
            var fieldNames = ['fullName', 'email', 'password', 'confirmPassword'];
            return fieldNames.reduce(function(fields, field) {
                fields[field] = this.refs[field].getValue();
                return fields;
            }.bind(this), {});
        },
        allFieldsNotEmpty: function() {
            var allFields = this.getAllFields();
            return Object.getOwnPropertyNames(allFields).every(function(fieldName) {
                return allFields[fieldName].length !== 0;
            });
        },
        onChange: function() {
            this.setState({buttonDisabled: !(this.passwordsMatch() && this.allFieldsNotEmpty())});
        },
        submitStore: function() {
            var route = jsRoutes.controllers.Managers.store();
            $.ajax({
                method: route.type,
                url: route.url,
                contentType: 'text/json',
                data: JSON.stringify(this.getAllFields()),
                success: function() {
                    this.transitionTo('managers-list');
                }.bind(this),
                error: function() {
                    this.setState({error:'errors.submitError'});
                }.bind(this),
            });
        },
    });
});
