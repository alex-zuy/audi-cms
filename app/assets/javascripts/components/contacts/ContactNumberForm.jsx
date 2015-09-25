define(['react', 'allMixins', 'mui', 'js/inputs/inputs'], function(React, allMixins, mui, inputs) {

    const {TextInput, HiddenInput, I18nTextInput} = inputs;
    const {FloatingActionButton, FontIcon, Paper} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
            allMixins.FormMixin,
        ],
        propTypes: {
            onItemSubmited: React.PropTypes.func.isRequired,
            onCancel: React.PropTypes.func.isRequired,
            item: React.PropTypes.object,
        },
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.contacts.fillForm.numberForm',
                formMixin: {
                    fieldRefs: ['name', 'number', 'contactInfoId'],
                    validateRoute: () => jsRoutes.controllers.Contacts.validateNumber(),
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
                            ref="number"
                            hintText={this.getMsg('inputs.number.placeholder')}/>
                        <FloatingActionButton
                            onClick={this.onClick}
                            mini={true}
                            className="right-align"
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
                ? jsRoutes.controllers.Contacts.storeNumber()
                : jsRoutes.controllers.Contacts.updateNumber(this.props.item.id);
            this.submitForm(route, {
                success: () => this.props.onItemSubmited()
            });
        }
    });
});
