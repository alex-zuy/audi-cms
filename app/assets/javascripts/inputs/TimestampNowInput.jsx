define(['react', 'moment'], function(React, moment) {
    return React.createClass({
        render() { return <div/>; },
        setValue() {},
        getValue() { return moment().format('YYYY-MM-DD HH:mm:ss'); },
        isEmpty() { return false; }
    });
});
