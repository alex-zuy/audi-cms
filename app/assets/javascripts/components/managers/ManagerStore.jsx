define(['react', 'reactRouter', 'javascripts/components/ErrorPanel', 'mui', 'allMixins', 'js/inputs/inputs'],
    function(React, ReactRouter, ErrorPanel, mui, allMixins, inputs) {

    const {TextInput} = inputs;
    var RaisedButton = mui.RaisedButton;

    return React.createClass({
        mixins: [
            ReactRouter.Navigation,
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
            allMixins.FormMixin,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'managersCtl.store',
                formMixin: {
                    fieldRefs: ['fullName', 'email', 'password'],
                    validateRoute: function() { return jsRoutes.controllers.Managers.validateStore(); },
                    validateDelay: 800,
                }
            }
        },
        getInitialState() {
            return {
                error: null,
                passwordsMatch: false,
            };
        },
        render() {
            return (
                <div>
                    <h5>{this.getMsg('labels.title')}</h5>
                    <form onChange={this.onChange}>
                        <ErrorPanel errorKey={this.state.error}/>
                        <TextInput
                            ref="fullName"
                            floatingLabelText={this.getMsg('inputs.fullName.label')}
                            hintText={this.getMsg('inputs.fullName.placeholder')}
                            /><br/>
                        <TextInput
                            ref="email"
                            floatingLabelText={this.getMsg('inputs.email.label')}
                            hintText={this.getMsg('inputs.email.placeholder')}
                            /><br/>
                        <TextInput
                            ref="password"
                            onChange={this.clearConfirmPassword}
                            floatingLabelText={this.getMsg('inputs.password.label')}
                            hintText={this.getMsg('inputs.password.placeholder')}
                            type="password"
                            /><br/>
                        <TextInput
                            ref="confirmPassword"
                            onBlur={this.onConfirmPasswordBlur}
                            floatingLabelText={this.getMsg('inputs.confirmPassword.label')}
                            hintText={this.getMsg('inputs.confirmPassword.placeholder')}
                            type="password"
                            /><br/>
                        <RaisedButton
                            onClick={this.submitStore}
                            label={this.getMsg('actions.store')}
                            disabled={!(this.state.formMixin.fieldsValid && this.state.passwordsMatch)}
                            primary={true}
                            />
                    </form>
                </div>
            );
        },
        clearConfirmPassword() {
            this.refs.confirmPassword.setValue('');
            this.refs.confirmPassword.setErrorText('');
        },
        onConfirmPasswordBlur() {
            if(!this.passwordsMatch()) {
                this.refs.confirmPassword.setErrorText(this.getMsg('errors.passwordsNotEqual'));
            }
        },
        passwordsMatch() {
            return this.refs.password.getValue() === this.refs.confirmPassword.getValue();
        },
        onChange() {
            this.setState({passwordsMatch: this.passwordsMatch()});
            this.onFormChangeValidate();
        },
        submitStore() {
            this.submitForm(jsRoutes.controllers.Managers.store(), {
                success: () => this.transitionTo('managers-list'),
                error: () => this.setState({error:'errors.submitError'})
            });
        },
    });
});
