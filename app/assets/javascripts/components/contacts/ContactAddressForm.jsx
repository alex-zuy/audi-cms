define(['react', 'allMixins', 'mui', 'js/inputs/inputs'], function(React, allMixins, mui, inputs) {

    const {HiddenInput, TextInput, MapInput} = inputs;
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
                msgKeyPrefix: 'controlPanel.contacts.fillForm.addressForm',
                formMixin: {
                    fieldRefs: ['name', 'address', 'geoCoordinates', 'contactInfoId'],
                    optionalFieldRefs: ['geoCoordinates'],
                    validateRoute: () => jsRoutes.controllers.Contacts.validateAddress(),
                    submitRoute: function() {
                        if(typeof this.props.item === 'object') {
                            return jsRoutes.controllers.Contacts.updateAddress(this.props.item.id);
                        }
                        else {
                            return jsRoutes.controllers.Contacts.storeAddress();
                        }
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
                        <TextInput
                            ref="name"
                            hintText={this.getMsg('inputs.name.placeholder')}/>
                        <TextInput
                            ref="address"
                            hintText={this.getMsg('inputs.address.placeholder')}/>
                        <FloatingActionButton
                            onClick={this.onClick}
                            mini={true}
                            className="right-align"
                            style={{float: "right", marginLeft: "auto", marginRight: "2%"}}
                            disabled={!this.state.formMixin.fieldsValid}>
                            <FontIcon className="material-icons">save</FontIcon>
                        </FloatingActionButton>
                        <MapInput
                            ref="geoCoordinates"/>
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
