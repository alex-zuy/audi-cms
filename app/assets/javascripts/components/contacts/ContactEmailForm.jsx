define(['react', 'allMixins', 'mui',
    'js/inputs/inputs'
], function(React, allMixins, mui, inputs) {

    const {TextInput, HiddenInput, I18nTextInput} = inputs;
    const {Paper, FloatingActionButton, FontIcon} = mui;


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
                    validateDelay: 800,
                },
            };
        },
        render() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "10px"}}>
                    <form onChange={this.onFormChangeValidate} className="form-horizontal" style={{width: "100%"}}>
                        <FloatingActionButton
                            onClick={this.props.onCancel}
                            mini={true}>
                            <FontIcon className="material-icons">cancel</FontIcon>
                        </FloatingActionButton>
                        <HiddenInput ref="contactInfoId" value={this.props.contactInfoId}/>
                        <I18nTextInput
                            languages={["en", "ru"]}
                            requiredLanguages={["en"]}
                            ref="name"/>
                        <TextInput
                            ref="email"
                            hintText={this.getMsg('inputs.email.placeholder')}/>
                        <TextInput
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
            const route = _.isUndefined(this.props.item)
                ? jsRoutes.controllers.Contacts.storeEmail()
                : jsRoutes.controllers.Contacts.updateEmail(this.props.item.id);
            this.submitForm(route, {
                success: () => this.props.onItemSubmited()
            });
        }
    });
});
