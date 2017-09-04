import React from 'react';
import ReactRouter from 'react-router';
import TodoDummy from 'components/TodoDummy';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import mui from 'mui';

var RouteHandler = ReactRouter.RouteHandler;
var RaisedButton = mui.RaisedButton;
var ThemeManager = new mui.Styles.ThemeManager();

var App = React.createClass({
    childContextTypes: {
        locale: React.PropTypes.string.isRequired,
        messages: React.PropTypes.object.isRequired,
        defaultLanguage: React.PropTypes.string.isRequired,
        supportedLanguages: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            locale: this.props.locale,
            messages: this.props.localeData.translations,
            defaultLanguage: this.props.localeData.defaultLanguage,
            supportedLanguages: this.props.localeData.supportedLanguages,
            muiTheme: ThemeManager.getCurrentTheme()
        }
    },
    render: function() {
        return (
            <RouteHandler/>
        );
    }
});

export default App;
