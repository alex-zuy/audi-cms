define(['react', 'mui'], function(React, mui) {

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

    return React.createClass({
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

});
