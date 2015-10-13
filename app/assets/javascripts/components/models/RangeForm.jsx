define(['react', 'allMixins', 'mui',
    'js/inputs/inputs',
    'js/components/GenericForm',
], function(React, allMixins, mui, inputs, GenericForm) {

    const {TextInput, HiddenInput, I18nTextInput} = inputs;
    const {Paper, RaisedButton} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
        ],
        propTypes: {
            onItemSubmited: React.PropTypes.func.isRequired,
            onCancel: React.PropTypes.func.isRequired,
            item: React.PropTypes.object,
        },
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.models.ranges',
            };
        },
        render() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "10px"}}>
                    <RaisedButton
                        onClick={this.props.onCancel}
                        label={this.getMsg('actions.cancel')}/>
                    <div style={{paddingTop: '15px'}}/>
                    <GenericForm
                        ref="form"
                        fields={[
                            {ref: 'name', editorComponent: I18nTextInput, isRequired: true},
                            {ref: 'description', editorComponent: I18nTextInput, isRequired: false},
                        ]}
                        validateRoute={() => jsRoutes.controllers.Models.validateRange()}
                        onSubmitAttempt={this.onClick}
                        msgKeyPrefix="controlPanel.models.ranges"/>
                </Paper>
            );
        },
        componentDidMount() {
            if(_.isObject(this.props.item)) {
                this.refs.form.fillForm(this.props.item);
            }
        },
        onClick() {
            const route = _.isUndefined(this.props.item)
                ? jsRoutes.controllers.Models.storeRange()
                : jsRoutes.controllers.Models.updateRange(this.props.item.id);
            this.refs.form.submitForm(route, {
                success: () => this.props.onItemSubmited()
            });
        }
    });
});
