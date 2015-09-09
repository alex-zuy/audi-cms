define(['react', 'reactRouter', 'javascripts/mixins/allMixins', 'mui', 'js/inputs/inputs', 'js/components/GenericForm'], function(React, ReactRouter, allMixin, mui, inputs, GenericForm) {

    const {TextInput} = inputs;
    var Paper = mui.Paper;
    var RaisedButton = mui.RaisedButton;

    const formFields = [
        { ref: 'fullName', editorComponent: TextInput, isRequired: true},
        { ref: 'email', editorComponent: TextInput, isRequired: true},
    ];

    return React.createClass({
        mixins: [
            ReactRouter.Navigation,
            allMixin.IntlMixin,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'managersCtl.update',
            };
        },
        render: function() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "50px"}}>
                    <h5>{this.getMsg('labels.title')}</h5>
                    <GenericForm
                        ref="form"
                        fields={formFields}
                        msgKeyPrefix={this.props.msgKeyPrefix}
                        validateRoute={() => jsRoutes.controllers.Managers.validateUpdate(this.props.params.id)}
                        onSubmitAttempt={this.onSubmitForm}/>
                </Paper>
            );
        },
        onSubmitForm() {
            this.refs.form.submitForm(jsRoutes.controllers.Managers.update(this.props.params.id), {
                complete: () => this.transitionTo('managers-list')
            });
        },
        componentDidMount() {
            this.refs.form.loadItem(jsRoutes.controllers.Managers.show(this.props.params.id));
        }
    });
});
