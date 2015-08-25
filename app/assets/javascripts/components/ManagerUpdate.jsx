define(['react', 'react-router', 'javascripts/mixins/allMixins', 'mui'], function(React, ReactRouter, allMixin, mui) {

    var TextField = mui.TextField;
    var Paper = mui.Paper;
    var RaisedButton = mui.RaisedButton;

    return React.createClass({
        mixins: [
            ReactRouter.Navigation,
            allMixin.IntlMixin,
            allMixin.AjaxMixin,
            allMixin.FormMixin,
            allMixin.DelayedFormValidateMixin,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'managersCtl.update',
                formMixin: {
                    fieldRefs: ['fullName', 'email'],
                    validateRoute: function() {
                        return jsRoutes.controllers.Managers.validateUpdate(this.props.params.id);
                    },
                    submitRoute: function() {
                        return jsRoutes.controllers.Managers.update(this.props.params.id);
                    },
                },
                delayedFormValidateMixin: {
                    delay: 800,
                },
            };
        },
        render: function() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "50px"}}>
                    <h5>{this.getMsg('labels.title')}</h5>
                    <form onChange={this.onFormChangedCallback}>
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
                        <RaisedButton
                            onClick={this.onSubmitForm}
                            label={this.getMsg('actions.update')}
                            primary={true}
                            disabled={!this.state.formMixin.fieldsValid}
                            />
                    </form>
                </Paper>
            );
        },
        onSubmitForm: function() {
            this.submitForm({complete: function() {
                this.transitionTo('managers-list');
            }.bind(this)});
        },
        componentDidMount: function() {
            this.ajax(jsRoutes.controllers.Managers.show(this.props.params.id), {
                success: function(mgr) {
                    this.refs.fullName.setValue(mgr.fullName);
                    this.refs.email.setValue(mgr.email);
                }.bind(this)
            });
        }
    });
});
