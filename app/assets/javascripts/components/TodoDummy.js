import React from 'react';
import ReactRouter from 'react-router';

var TodoDummy = React.createClass({
    getDefaultProps: function() {
        return {text: "Todo Dummy"}
    },
    render: function() {
        var style = {color: 'white', backgroundColor: 'red'};
        return (
            <div style={style}>{this.props.text}</div>
        );
    }
});

export default TodoDummy;
