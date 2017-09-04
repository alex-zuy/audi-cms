import React from 'react';
import mui from 'mui';

const RPT = React.PropTypes;
const {DropDownMenu} = mui;

export default React.createClass({
    propTypes: {
        label: RPT.string.isRequired,
        alternatives: RPT.arrayOf(RPT.shape({
            label: RPT.string.isRequired,
            value: RPT.any.isRequired,
        })),
        initiallyUnselected: RPT.bool.isRequired,
    },
    getDefaultProps() {
        return {
            label: '',
            initiallyUnselected: false,
        }
    },
    getInitialState() {
        return {
            selectedIndex: 0,
        };
    },
    render() {

        return (
            <div>
                <label>{this.props.floatingLabelText}</label>
                <br/>
                <DropDownMenu
                    {...this.props}
                    selectedIndex={this.state.selectedIndex}
                    displayMember="label"
                    valueMember="value"
                    menuItems={this._getAlternatives()}
                    onChange={this.onChange}/>
            </div>
        );
    },
    _getAlternatives() {
        return (this.props.initiallyUnselected)
            ? _.union([{label:'', value: null}], this.props.alternatives)
            : this.props.alternatives;
    },
    onChange(e, selectedIndex) {
        this.setState({selectedIndex: selectedIndex});
        if(_.isFunction(this.props.onChange)) {
            this.props.onChange(this._getAlternatives()[selectedIndex].value);
        }
    },
    isEmpty() {
        if(this.props.initiallyUnselected) {
            return this.state.selectedIndex == 0;
        }
        else {
            return this.props.alternatives.length == 0;
        }
    },
    setValue(value) {
        const index = _.findIndex(this._getAlternatives(), ({value: v}) => v == value);
        this.setState({selectedIndex: index});
    },
    getValue() {
        if(this.isEmpty()) {
            return null;
        }
        else {
            return this._getAlternatives()[this.state.selectedIndex].value;
        }
    },
    setErrorText(text) {
        console.warn(`SelectInput.setErrorText called. Text: "${text}"`);
    }
})
