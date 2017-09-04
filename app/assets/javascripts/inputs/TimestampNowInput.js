import React from 'react';
import moment from 'moment';

export default React.createClass({
    render() { return <div/>; },
    setValue() {},
    getValue() { return moment().format('YYYY-MM-DD HH:mm:ss'); },
    isEmpty() { return false; }
});
