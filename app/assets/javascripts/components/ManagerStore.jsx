define(['react', 'react-router', 'intl-mixin', 'javascripts/components/ErrorPanel', 'mui', 'javascripts/mixins/AjaxMixin', 'javascripts/mixins/FormMixin', 'javascripts/mixins/DelayedFormValidateMixin'], function(React, ReactRouter, IntlMixin, ErrorPanel, mui, AjaxMixin, FormMixin, DelayedValidate) {

    var TextField = mui.TextField;
    var RaisedButton = mui.RaisedButton;
    var Paper = mui.Paper;

    return React.createClass({
        mixins: [
            ReactRouter.Navigation,
            IntlMixin,
            AjaxMixin,
            FormMixin,
            DelayedValidate,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'managersCtl.store',
                delayedFormValidateMixin: {
                    delay: 800,
                },
                formMixin: {
                    fieldRefs: ['fullName', 'email', 'password'],
                    validateRoute: jsRoutes.controllers.Managers.validateStore(),
                    submitRoute: jsRoutes.controllers.Managers.store(),
                }
            }
        },
        getInitialState: function() {
            return {
                error: null,
            };
        },
        render: function() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "50px"}}>
                    <h5>{this.getMsg('labels.title')}</h5>
                    <form onChange={this.onFormChangedCallback}>
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
                            disabled={!this.state.formMixin.fieldsValid}
                            primary={true}
                            />
                    </form>
                </Paper>
            );
        },
        clearConfirmPassword: function() {
            this.refs.confirmPassword.clearValue();
            this.refs.confirmPassword.setErrorText('');
        },
        onConfirmPasswordBlur: function() {
            if(!this.passwordsMatch()) {
                this.refs.confirmPassword.setErrorText(this.getMsg('errors.passwordsNotEqual'));
            }
        },
        passwordsMatch: function() {
            return this.refs.password.getValue() === this.refs.confirmPassword.getValue();
        },
        onChange: function() {
            if(this.passwordsMatch()) {
                this.validateForm();
            }
        },
        submitStore: function() {
            this.submitForm({
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
