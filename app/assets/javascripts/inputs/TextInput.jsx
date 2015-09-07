define(['react', 'mui'], function(React, mui) {

    const {TextField} = mui;

    return React.createClass({
        propTypes: {
            emptyMeansNull: React.PropTypes.boolean,
        },
        getDefaultProps() {
            return {
                emptyMeansNull: false,
            }
        },
        render() {
            return <TextField ref="field" {...this.props}/>
        },
        setValue(value) {
            this.refs.field.setValue(value);
        },
        getValue() {
            const fieldValue = this.refs.field.getValue();
            if(this.props.emptyMeansNull) {
                return this.isEmpty() ? null : fieldValue;
            }
            else {
                return fieldValue;
            }
        },
        isEmpty() {
            return this.refs.field.getValue().length === 0;
        },
        setErrorText(errorText) {
            this.refs.field.setErrorText(errorText);
        },
    });
});
