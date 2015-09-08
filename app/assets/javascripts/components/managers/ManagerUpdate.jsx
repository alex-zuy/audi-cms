define(['react', 'reactRouter', 'javascripts/mixins/allMixins', 'mui', 'js/inputs/inputs', 'js/components/GenericForm'], function(React, ReactRouter, allMixin, mui, inputs, GenericForm) {

    const {TextInput} = inputs;
    var Paper = mui.Paper;
    var RaisedButton = mui.RaisedButton;

    const formFields = [
        { ref: 'fullName', editorComponent: TextInput},
        { ref: 'email', editorComponent: TextInput}
    ];

    return React.createClass({
        mixins: [
            ReactRouter.Navigation,
            allMixin.IntlMixin,
            allMixin.AjaxMixin,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'managersCtl.update',
                formMixin: {
                    fieldRefs: ['fullName', 'email'],
                    validateRoute: function() {
                        return jsRoutes.controllers.Managers.validateUpdate(this.props.params.id);
                    }.bind(this),
                    validateDelay: 800,
                },
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
                        formMixin={{
                            fieldRefs: ['fullName', 'email'],
                            validateRoute: () => {
                                return jsRoutes.controllers.Managers.validateUpdate(this.props.params.id);
                            },
                            validateDelay: 800,
                        }}
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
