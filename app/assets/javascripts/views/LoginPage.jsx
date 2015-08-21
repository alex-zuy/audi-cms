define(['react', 'react-router', 'mui'], function(React, ReactRouter, mui) {

    var TextField = mui.TextField;
    var RaisedButton = mui.RaisedButton;
    var Paper = mui.Paper;

    var LoginPage = React.createClass({
        mixins: [
            ReactRouter.Navigation,
        ],
        getInitialState: function() {
            return {
                buttonDisabled: true,
                errors: '',
            }
        },
        render: function() {
            var hasErrors = this.state.errors.length !== 0;
            return (
                <div className="row" style={{ marginTop: "100px" }}>
                    <div className="col s12 m8 offset-m2 l6 offset-l3">
                        <Paper zDepth={4} rounded={false} style={{padding: "50px"}}>
                            <h5>key.login</h5>
                            <form onChange={this.enableDisableButton}>
                                <div style={{display: hasErrors ? 'initial' : 'none'}}>
                                    <div ref="errors" className="card-panel red lighten-1 white-text">{this.state.errors}</div>
                                </div>
                                <TextField
                                    ref="email"
                                    onEnterKeyDown={this.enterPressed}
                                    floatingLabelText="key.email"
                                    fullWidth={true}
                                    hintText="key.enter.login.email"
                                    type="text"/>
                                <TextField
                                    ref="password"
                                    onEnterKeyDown={this.enterPressed}
                                    floatingLabelText="key.password"
                                    fullWidth={true}
                                    hintText="key.enter.password"
                                    type="password"/>
                                <p>
                                    <RaisedButton
                                        disabled={this.state.buttonDisabled}
                                        onClick={this.attemptLogin}
                                        fullWidth={true}
                                        label="key.login"
                                        primary={true}/>
                                </p>
                            </form>
                        </Paper>
                    </div>
                </div>
            );
        },
        enterPressed: function() {
            if(!this.fieldsEmpty()) {
                this.attemptLogin();
            }
        },
        fieldsEmpty: function() {
            return this.refs.email.getValue().length === 0 || this.refs.password.getValue().length === 0;
        },
        attemptLogin: function() {
            var loginRoute = jsRoutes.controllers.Application.login();
            $.ajax({
                method: loginRoute.type,
                url: loginRoute.url,
                contentType: "text/json",
                data: JSON.stringify({
                    email: this.refs.email.getValue(),
                    password: this.refs.password.getValue()
                }),
                error: function(xhr, status, error) {
                    this.setState({errors:'key.no.such.user'});
                }.bind(this),
                success: function(data, status) {
                    this.transitionTo('control-panel')
                }.bind(this)
            });
        },
        enableDisableButton: function() {
            this.setState({buttonDisabled: this.fieldsEmpty()});
        }
    });

    return LoginPage;
});
