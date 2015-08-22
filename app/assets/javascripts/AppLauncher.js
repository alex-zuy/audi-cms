require.config({
    baseUrl: '/assets',
    paths: {
        'react': 'lib/react/dist/react-with-addons',
        'react-draggable2' : 'lib/react-draggable2/dist/react-draggable',
        'classnames' : 'lib/classnames/index',
        'react-router': 'lib/react-router/build/umd/ReactRouter',
        'intl-messageformat': 'lib/intl-messageformat/dist/intl-messageformat-with-locales',
        'intl-mixin': 'javascripts/intl/IntlMixin',
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

requirejs(['javascripts/ReactRouterLauncher'], function(Launcher) {

    $(function() {
        var route = jsRoutes.controllers.Application.translations();
        $.ajax({
            url: route.url,
            success: function(messages) {
                var maybeLocale = $("meta[name='app-lang']").attr('content');
                var locale = maybeLocale ? maybeLocale : 'en';
                Launcher.launch(locale, messages);
                console.log('App launched');
            }
        });
    });
});
