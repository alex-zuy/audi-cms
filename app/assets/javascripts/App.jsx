define([
        'react',
        'reactRouter',
        'javascripts/components/TodoDummy',
        'javascripts/components/Navbar',
        'js/components/Footer',
        'mui'
    ],
    function(React, ReactRouter, TodoDummy, Navbar, Footer, mui) {

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
                    defaultLanguage: this.props.localeData.translations.defaultLanguage,
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

        return App;
    }
);
