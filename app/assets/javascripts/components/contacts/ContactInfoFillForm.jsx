define(['react', 'reactRouter', 'mui', 'allMixins',
    'js/components/contacts/ContactNumberForm',
    'js/components/contacts/ContactEmailForm',
    'js/widgets/Switch',
    'js/components/ArrayDataFillForm'
], function(React, ReactRouter, mui, allMixins, ContactNumberForm, ContactEmailForm, switchWidget, ArrayDataFillForm) {

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
                        <h5 className="center-align">{this.getMsg('labels.numbers')}</h5>
                        <ArrayDataFillForm
                            data={this.state.contactInfo.numbers}
                            fieldNames={['name', 'number']}
                            msgKeyPrefix="controlPanel.contacts.fillForm.numberDataFillForm"
                            itemForm={ContactNumberForm}
                            itemFormProps={{contactInfoId: this.state.contactInfo.id}}
                            onItemSubmited={this.dataSubmited}
                            performDelete={this.performNumberDelete}/>
                        <h5 className="center-align">{this.getMsg('labels.emails')}</h5>
                        <ArrayDataFillForm
                            data={this.state.contactInfo.emails}
                            fieldNames={['name', 'email', 'contactPerson']}
                            msgKeyPrefix="controlPanel.contacts.fillForm.emailDataFillForm"
                            itemForm={ContactEmailForm}
                            itemFormProps={{contactInfoId: this.state.contactInfo.id}}
                            onItemSubmited={this.dataSubmited}
                            performDelete={this.performEmailDelete}/>
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
        },
        performEmailDelete(email) {
            this.ajax(jsRoutes.controllers.Contacts.deleteEmail(email.id), {
                success: () => this.loadContactInfo(),
            });
        }
    });
});
