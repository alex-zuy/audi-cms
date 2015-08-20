define(['react', 'react-router', 'mui'], function(React, ReactRouter, mui) {

    var TextField = mui.TextField;
    var RaisedButton = mui.RaisedButton;
    var Paper = mui.Paper;

    var LoginPage = React.createClass({
        getInitialState: function() {
            return {
                buttonDisabled: true
            }
        },
        render: function() {
            return (
                <div className="row" style={{ marginTop: "100px" }}>
                    <div className="col s12 m8 offset-m2 l6 offset-l3">
                        <Paper zDepth={4} rounded={false} style={{padding: "50px"}}>
                            <h5>key.login</h5>
                            <form onChange={this.enableDisableButton}>
                                <TextField
                                    ref="email"
                                    floatingLabelText="key.email"
                                    fullWidth={true}
                                    hintText="key.enter.login.email"
                                    type="text"/>
                                <TextField
                                    ref="password"
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
        attemptLogin: function() {
            console.log('Attempt login');
        },
        enableDisableButton: function() {
            var emailEmpty = this.refs.email.getValue().length === 0;
            var passwordEmpty = this.refs.password.getValue().length === 0;
            this.setState({buttonDisabled: emailEmpty || passwordEmpty});
        }
    });

    return LoginPage;
});
