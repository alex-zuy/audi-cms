define(['react', 'reactRouter', 'javascripts/mixins/allMixins', 'mui', 'js/inputs/inputs'], function(React, ReactRouter, allMixin, mui, inputs) {

    const {TextInput} = inputs;
    var Paper = mui.Paper;
    var RaisedButton = mui.RaisedButton;

    return React.createClass({
        mixins: [
            ReactRouter.Navigation,
            allMixin.IntlMixin,
            allMixin.AjaxMixin,
            allMixin.FormMixin,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'managersCtl.update',
                formMixin: {
                    fieldRefs: ['fullName', 'email'],
                    validateRoute: function() {
                        return jsRoutes.controllers.Managers.validateUpdate(this.props.params.id);
                    },
                    validateDelay: 800,
                },
            };
        },
        render: function() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "50px"}}>
                    <h5>{this.getMsg('labels.title')}</h5>
                    <form onChange={this.onFormChangeValidate}>
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
        onSubmitForm() {
            this.submitForm(jsRoutes.controllers.Managers.update(this.props.params.id), {
                complete: () => this.transitionTo('managers-list')
            });
        },
        componentDidMount() {
            this.loadItem(jsRoutes.controllers.Managers.show(this.props.params.id));
        }
    });
});
