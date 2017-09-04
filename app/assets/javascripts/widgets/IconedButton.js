import React from 'react';
import mui from 'mui';

var FontIcon = mui.FontIcon;
var RaisedButton = mui.RaisedButton;

var fontIconStyle = {
    height: '100%',
    display: 'inline-block',
    verticalAlign: 'middle',
    float: 'left',
    paddingLeft: '12px',
    lineHeight: '36px',
};

export default React.createClass({
    propTypes: {
        iconName: React.PropTypes.string.isRequired,
    },
    render: function() {
        return (
            <RaisedButton {...this.props}>
                <FontIcon className="material-icons" style={fontIconStyle}>{this.props.iconName}</FontIcon>
            </RaisedButton>
        );
    }
})
