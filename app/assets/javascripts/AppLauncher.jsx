require.config({
    baseUrl: '/assets',
    paths: {
        'react': 'lib/react/dist/react-with-addons',
        'react-draggable2' : 'lib/react-draggable2/dist/react-draggable',
        'classnames' : 'lib/classnames/index',
        'react-router': 'lib/react-router/build/umd/ReactRouter',
        'intl-messageformat': 'lib/intl-messageformat/dist/intl-messageformat-with-locales',
        'intl-mixin': 'javascripts/mixins/IntlMixin',
    },
    map: {
        '*' : {
            'react/addons' : 'react',
            'React' : 'react'
        }
    },
    packages: [
        {
            name: 'mui',
            location: 'lib/material-ui/lib',
            main: 'index'
        }
    ]
});

requirejs(['react', 'react-router', 'javascripts/Routes'], function(React, ReactRouter, routes) {

    // hack to workaround issue in material-ui. see https://github.com/callemall/material-ui/issues/1486
    window.process = {env:{NODE_ENV:''}};

    function launchApp(messages) {

        ReactRouter.run(routes, ReactRouter.HashLocation, function(App) {
            React.render(<App locale={getLocale()} messages={messages}/>, document.body);
        });

        console.log('App launched');
    }

    function getLocale() {
        var maybeLocale = $("meta[name='app-lang']").attr('content');
        return maybeLocale ? maybeLocale : 'en';
    }

    $(function() {
        var route = jsRoutes.controllers.Application.translations();
        $.ajax({ url: route.url, success:launchApp });
    });
});
