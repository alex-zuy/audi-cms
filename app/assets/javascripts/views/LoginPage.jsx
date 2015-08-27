define(['react', 'reactRouter', 'mui', 'allMixins', 'javascripts/components/ErrorPanel'], function(React, ReactRouter, mui, allMixins, ErrorPanel) {

    var TextField = mui.TextField;
    var RaisedButton = mui.RaisedButton;
    var Paper = mui.Paper;

    var LoginPage = React.createClass({
        mixins: [
            ReactRouter.Navigation,
            allMixins.IntlMixin,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'loginPage',
            }
        },
        getInitialState: function() {
            return {
                buttonDisabled: true,
                error: null,
            }
        },
        render: function() {
            return (
                <div className="row" style={{ marginTop: "100px" }}>
                    <div className="col s12 m8 offset-m2 l6 offset-l3">
                        <Paper zDepth={4} rounded={false} style={{padding: "50px"}}>
                            <h5>{this.getMsg('labels.login')}</h5>
                            <form onChange={this.enableDisableButton}>
                                <ErrorPanel msgKeyPrefix={this.props.msgKeyPrefix} errorKey={this.state.error}/>
                                <TextField
                                    ref="email"
                                    onEnterKeyDown={this.enterPressed}
                                    floatingLabelText={this.getMsg('inputs.email.label')}
                                    fullWidth={true}
                                    hintText={this.getMsg('inputs.email.placeholder')}
                                    type="text"/>
                                <TextField
                                    ref="password"
                                    onEnterKeyDown={this.enterPressed}
                                    floatingLabelText={this.getMsg('inputs.password.label')}
                                    fullWidth={true}
                                    hintText={this.getMsg('inputs.password.placeholder')}
                                    type="password"/>
                                <p>
                                    <RaisedButton
                                        disabled={this.state.buttonDisabled}
                                        onClick={this.attemptLogin}
                                        fullWidth={true}
                                        label={this.getMsg('actions.login')}
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
                    this.setState({error:'errors.noSuchUser'});
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
