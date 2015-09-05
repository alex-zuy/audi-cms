define(['react', 'allMixins', 'mui', 'js/widgets/HiddenInput'], function(React, allMixins, mui, HiddenInput) {

    const {TextField, FloatingActionButton, FontIcon, Paper} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
            allMixins.FormMixin,
            allMixins.DelayedFormValidateMixin,
        ],
        propTypes: {
            onItemSubmited: React.PropTypes.func.isRequired,
            onCancel: React.PropTypes.func.isRequired,
            item: React.PropTypes.object,
        },
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.contacts.numberForm',
                formMixin: {
                    fieldRefs: ['name', 'number', 'contactInfoId'],
                    validateRoute: () => jsRoutes.controllers.Contacts.validateNumber(),
                    submitRoute: function() {
                        if(typeof this.props.item === 'object') {
                            return jsRoutes.controllers.Contacts.updateNumber(this.props.item.id);
                        }
                        else {
                            return jsRoutes.controllers.Contacts.storeNumber();
                        }
                    },
                },
                delayedFormValidateMixin: {
                    delay: 800,
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
            this.submitForm({
                success: () => this.props.onItemSubmited()
            });
        }
    });
});
