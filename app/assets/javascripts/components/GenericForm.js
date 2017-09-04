import React from 'react';
import allMixins from 'mixins/allMixins';
import mui from 'mui';

const {RaisedButton} = mui;

const FormImpl = React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        allMixins.FormMixin,
    ],
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
                            {(() => this.props.formVertical ? <br/> : <div/>)()}
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

export default React.createClass({
    propTypes: {
        fields: React.PropTypes.arrayOf(React.PropTypes.shape({
            ref: React.PropTypes.string.isRequired,
            editorComponent: React.PropTypes.func.isRequired,
            props: React.PropTypes.object,
            isRequired: React.PropTypes.bool.isRequired
        })),
        validateRoute: React.PropTypes.func.isRequired,
        formProps: React.PropTypes.object,
        formVertical: React.PropTypes.bool,
        onSubmitAttempt: React.PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            formVertical: true,
        };
    },
    render() {
        return (
            <FormImpl
                ref="form"
                formMixin={getFormMixinProps(this.props.fields, this.props.validateRoute)}
                {..._.omit(this.props, 'validateRoute')}/>
        );
    },
    fillForm(...a) { this.refs.form.fillForm(...a) },
    loadItem(...a) { this.refs.form.loadItem(...a) },
    submitForm(...a) { this.refs.form.submitForm(...a) },
});

function getFormMixinProps(fieldsProps, validateRoute) {
    return {
        fieldRefs: fieldsProps.map(_.property('ref')),
        optionalFieldRefs: fieldsProps.filter(f => !f.isRequired).map(_.property('ref')),
        validateRoute: validateRoute,
        validateDelay: 800,
    };
}
