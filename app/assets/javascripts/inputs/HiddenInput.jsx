define(['react'], function(React) {

    return React.createClass({
        getDefaultProps() {
            return { value: null };
        },
        getInitialState() {
            return { value: this.props.value };
        },
        componentWillReceiveProps(props) {
            this.setState({value: props.value});
        },
        render() { return <div/> },
        setValue(value) { this.setState({value: value}) },
        getValue() { return this.state.value },
        isEmpty() { return this.getValue() == null }
    });
});
