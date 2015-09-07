define(['react', 'allMixins', 'mui',
    'js/inputs/HiddenInput'
], function(React, allMixins, mui, HiddenInput) {

    const {Paper, FloatingActionButton, FontIcon, TextField} = mui;


    return React.createClass({
        mixins: [
            allMixins.AjaxMixin,
            allMixins.IntlMixin,
            allMixins.FormMixin,
        ],
        propTypes: {
            onItemSubmited: React.PropTypes.func.isRequired,
            onCancel: React.PropTypes.func.isRequired,
            item: React.PropTypes.object,
        },
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.contacts.fillForm.emailForm',
                formMixin: {
                    fieldRefs: ['name', 'email', 'contactPerson', 'contactInfoId'],
                    validateRoute: () => jsRoutes.controllers.Contacts.validateEmail(),
                    submitRoute: function() {
                        return (typeof this.props.item === 'object')
                            ? jsRoutes.controllers.Contacts.updateEmail(this.props.item.id)
                            : jsRoutes.controllers.Contacts.storeEmail();
                    },
                    validateDelay: 800,
                },
            };
        },
        render() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "10px"}}>
                    <form onChange={this.onFormChangedCallback} className="form-horizontal" style={{width: "100%"}}>
                        <FloatingActionButton
                            onClick={this.props.onCancel}
                            mini={true}>
                            <FontIcon className="material-icons">cancel</FontIcon>
                        </FloatingActionButton>
                        <HiddenInput ref="contactInfoId" value={this.props.contactInfoId}/>
                        <TextField
                            ref="name"
                            hintText={this.getMsg('inputs.name.placeholder')}/>
                        <TextField
                            ref="email"
                            hintText={this.getMsg('inputs.email.placeholder')}/>
                        <TextField
                            ref="contactPerson"
                            hintText={this.getMsg('inputs.contactPerson.placeholder')}/>
                        <FloatingActionButton
                            onClick={this.onClick}
                            mini={true}
                            style={{float: "right", marginLeft: "auto", marginRight: "2%"}}
                            disabled={!this.state.formMixin.fieldsValid}>
                            <FontIcon className="material-icons">save</FontIcon>
                        </FloatingActionButton>
                    </form>
                </Paper>
            );
        },
        componentDidMount() {
            if(typeof this.props.item === 'object') {
                this.fillForm(this.props.item);
            }
        },
        onClick() {
            this.submitForm({
                success: () => this.props.onItemSubmited()
            });
        }
    });
});
