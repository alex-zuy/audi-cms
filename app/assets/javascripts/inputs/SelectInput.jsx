define(['react', 'mui'], function(React, mui) {

    const RPT = React.PropTypes;
    const {DropDownMenu} = mui;

    return React.createClass({
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
        },
        isEmpty() {
            return (this.state.selectedIndex === 0)
                && (this.props.alternatives.length > 0)
                && _.isNull(this.props.alternatives[0].value);
        },
        setValue(value) {
            const index = _.findIndex(this.props.alternatives, ({value: v}) => v == value);
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
});