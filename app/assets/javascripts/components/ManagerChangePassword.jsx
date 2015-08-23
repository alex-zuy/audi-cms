define(['react', 'react-router', 'intl-mixin', 'mui'], function(React, ReactRouter, IntlMixin, mui) {

    var Paper = mui.Paper;
    var TextField = mui.TextField;
    var RaisedButton = mui.RaisedButton;

    return React.createClass({
        mixins: [
            ReactRouter.Navigation,
            IntlMixin,
        ],
        getInitialState: function() {
            return {
                manager: {
                    id: '',
                    fullName: '',
                    email: '',
                    isAdmin: false,
                },
                buttonDisabled: true,
                submitError: null,
            }
        },
        render: function() {
            var submitError = (this.state.submitError != null)
                ? ( <div ref="errors" className="card-panel red lighten-1 white-text">
                        {this.getIntlMessage(this.state.submitError)}
                    </div>)
                : ('');
            return (
                <Paper zDepth={2} rounded={false} style={{padding:"50px"}}>
                    <h5>{this.getIntlMessage('labels.managersCtl.changePassword.title')}</h5>
                    <p>{this.state.manager.fullName}</p>
                    <form onChange={this.enableDisableButton}>
                        {submitError}
                        <TextField
                            ref="password"
                            onChange={this.passwordChanged}
                            onEnterKeyDown={this.enterPressed}
                            floatingLabelText={this.getIntlMessage('inputs.managersCtl.changePassword.password.label')}
                            hintText={this.getIntlMessage('inputs.managersCtl.changePassword.password.placeholder')}
                            type="password"
                            /><br/>
                        <TextField
                            ref="confirmPassword"
                            onEnterKeyDown={this.enterPressed}
                            floatingLabelText={this.getIntlMessage('inputs.managersCtl.changePassword.confirmPassword.label')}
                            hintText={this.getIntlMessage('inputs.managersCtl.changePassword.confirmPassword.placeholder')}
                            type="password"
                            />
                        <p>
                            <RaisedButton
                                disabled={this.state.buttonDisabled}
                                ref="button"
                                onClick={this.checkPasswordsAndStore}
                                label={this.getIntlMessage('actions.managersCtl.store')}
                                primary={true}
                                />
                        </p>
                    </form>
                </Paper>
            );
        },
        componentWillMount: function() {
            var route = jsRoutes.controllers.Managers.show(this.props.params.id);
            $.ajax({
                url: route.url,
                success: function(manager) {
                    this.setState({manager: manager});
                }.bind(this)
            });
        },
        fieldsEmpty: function() {
            return this.refs.password.getValue().length === 0 || this.refs.confirmPassword.getValue().length === 0;
        },
        enterPressed: function() {
            if(!this.fieldsEmpty()) {
                this.checkPasswordsAndStore();
            }
        },
        passwordChanged: function() {
            this.refs.confirmPassword.clearValue();
        },
        checkPasswordsAndStore: function() {
            var password = this.refs.password.getValue();
            if(password === this.refs.confirmPassword.getValue()) {
                var route = jsRoutes.controllers.Managers.changePassword(this.state.manager.id);
                $.ajax({
                    method: route.type,
                    url: route.url,
                    contentType: 'text/json',
                    data: JSON.stringify({password:password}),
                    success: function() {
                        this.transitionTo('managers-list');
                    }.bind(this),
                    error: function() {
                        this.setState({submitError:'errors.managersCtl.changePassword.submitError'});
                    }.bind(this)
                });
            }
            else {
                this.refs.confirmPassword.setErrorText(this.getIntlMessage('errors.managersCtl.changePassword.passwordsNotEqual'));
            }
        },
        enableDisableButton: function() {
            this.setState({buttonDisabled: this.fieldsEmpty()});
        }
    })
});
