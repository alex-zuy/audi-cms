define(['react', 'allMixins', 'mui'], function(React, allMixins, mui) {

    const {RaisedButton} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
            allMixins.FormMixin,
        ],
        propTypes: {
            fields: React.PropTypes.arrayOf(React.PropTypes.shape({
                ref: React.PropTypes.string.isRequired,
                editorComponent: React.PropTypes.func.isRequired,
                props: React.PropTypes.object,
            })),
            formProps: React.PropTypes.object,
            onSubmitAttempt: React.PropTypes.func.isRequired
        },
        render() {
            return (
                <form onChange={this.onFormChangeValidate} {...this.props.formProps}>{
                    this.props.fields.map((field, index) =>
                        <div>
                            <field.editorComponent
                                ref={field.ref}
                                key={`field-${index}`}
                                floatingLabelText={this.getMsg(`inputs.${field.ref}.label`)}
                                hintText={this.getMsg(`inputs.${field.ref}.placeholder`)}
                                {...field.props}/>
                            <br/>
                        </div>
                    )
                }
                    <RaisedButton
                        onClick={this.props.onSubmitAttempt}
                        label={this.getMsg('actions.submit')}
                        disabled={!this.state.formMixin.fieldsValid}
                        primary={true}/>
                </form>
            );
        }
    });
});
