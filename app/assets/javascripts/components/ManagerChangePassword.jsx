define(['react', 'reactRouter', 'allMixins', 'mui', 'javascripts/components/ErrorPanel'], function(React, ReactRouter, allMixins, mui, ErrorPanel) {

    var Paper = mui.Paper;
    var TextField = mui.TextField;
    var RaisedButton = mui.RaisedButton;

    return React.createClass({
        mixins: [
            ReactRouter.Navigation,
            allMixins.IntlMixin,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'managersCtl.changePassword',
            };
        },
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
            return (
                <Paper zDepth={2} rounded={false} style={{padding:"50px"}}>
                    <h5>{this.getMsg('labels.title')}</h5>
                    <p>{this.state.manager.fullName}</p>
                    <form onChange={this.enableDisableButton}>
                        <ErrorPanel msgKeyPrefix={this.props.msgKeyPrefix} errorKey={this.state.submitError}/>
                        <TextField
                            ref="password"
                            onChange={this.passwordChanged}
                            onEnterKeyDown={this.enterPressed}
                            floatingLabelText={this.getMsg('inputs.password.label')}
                            hintText={this.getMsg('inputs.password.placeholder')}
                            type="password"
                            /><br/>
                        <TextField
                            ref="confirmPassword"
                            onEnterKeyDown={this.enterPressed}
                            floatingLabelText={this.getMsg('inputs.confirmPassword.label')}
                            hintText={this.getMsg('inputs.confirmPassword.placeholder')}
                            type="password"
                            />
                        <p>
                            <RaisedButton
                                disabled={this.state.buttonDisabled}
                                ref="button"
                                onClick={this.checkPasswordsAndStore}
                                label={this.getMsg('actions.store')}
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
                        this.setState({submitError:'errors.submitError'});
                    }.bind(this)
                });
            }
            else {
                this.refs.confirmPassword.setErrorText(this.getMsg('errors.passwordsNotEqual'));
            }
        },
        enableDisableButton: function() {
            this.setState({buttonDisabled: this.fieldsEmpty()});
        }
    })
});
