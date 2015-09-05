define(['react', 'reactRouter', 'mui', 'allMixins',
    'js/components/contacts/ContactNumberForm',
    'js/widgets/Switch',
    'js/components/ArrayDataFillForm'
], function(React, ReactRouter, mui, allMixins, ContactNumberForm, switchWidget, ArrayDataFillForm) {

    const {Paper, FloatingActionButton, FontIcon, IconButton} = mui;
    const {Switch, Case, Default} = switchWidget;

    return React.createClass({
        mixins: [
            allMixins.AjaxMixin,
            allMixins.IntlMixin,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.contacts.fillForm',
            };
        },
        getInitialState() {
            return {
                contactInfo: {
                    name: '',
                    internalName: '',
                    numbers:[],
                    emails:[],
                    addresses:[],
                },
                currentAction: '',
                actionData: null,
            };
        },
        render() {
            const commonProps = {
                onItemSubmited: this.dataSubmited,
                onCancel: this.cancelAction,
                contactInfoId: this.state.contactInfo.id,
            };
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "20px"}}>
                    <p>{`${this.getMsg('labels.name')}: ${this.state.contactInfo.name}`}</p>
                    <p>{`${this.getMsg('labels.internalName')}: ${this.state.contactInfo.internalName}`}</p>
                    <div>
                        <p>{this.getMsg('labels.numbers')}:</p>
                        <ArrayDataFillForm
                            data={this.state.contactInfo.numbers}
                            fieldNames={['name', 'number']}
                            msgKeyPrefix="controlPanel.contacts.fillForm.numberDataFillForm"
                            itemForm={ContactNumberForm}
                            itemFormProps={{contactInfoId: this.state.contactInfo.id}}
                            onItemSubmited={this.dataSubmited}
                            performDelete={this.performNumberDelete}/>
                    </div>
                </Paper>
            );
        },
        componentWillMount() {
            this.loadContactInfo();
        },
        loadContactInfo() {
            this.ajax(jsRoutes.controllers.Contacts.show(this.props.params.id), {
                success: (ci) => this.setState({contactInfo: ci})
            });
        },
        dataSubmited() {
            this.loadContactInfo();
        },
        performNumberDelete(number) {
            this.ajax(jsRoutes.controllers.Contacts.deleteNumber(number.id), {
                success: () => this.loadContactInfo(),
            });
        }
    });
});
