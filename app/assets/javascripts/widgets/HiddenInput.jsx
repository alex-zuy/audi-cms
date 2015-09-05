define(['react', 'mui'], function(React, mui) {

    return React.createClass({
        getDefaultProps() {
            return {
                value: null,
            }
        },
        render() {
            return <input
                    ref="input"
                    type="hidden"
                    onChange={this.onChange}
                    value={this.props.value}/>;
        },
        setValue() {
        },
        getValue() {
            return this.props.value;
        },
    });
});
