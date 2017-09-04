import React from 'react';
import mui from 'mui';

const {TextField} = mui;

export default React.createClass({
    propTypes: {
        emptyMeansNull: React.PropTypes.bool,
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
