System.config({
    defaultJSExtensions: true,
    baseURL: '/assets',
    map: {
        'js': 'javascripts',
        react: 'lib/react/react',
        React: 'lib/react/react',
        'react/lib': 'lib/react/lib',
        'react/addons': 'lib/react/addons',
        reactRouter: 'lib/react-router/build/umd/ReactRouter',
        'react-draggable2': 'lib/react-draggable2/dist/react-draggable',
        'react-tap-event-plugin': 'lib/react-tap-event-plugin/injectTapEventPlugin',
        allMixins: 'javascripts/mixins/allMixins',
        mui: 'lib/material-ui/lib/index',
        IntlMessageFormat: 'lib/intl-messageformat/index',
        'intl-messageformat-parser': 'lib/intl-messageformat-parser/index',
        classnames: 'lib/classnames/index',
        jquery: 'lib/jquery/dist/jquery',
        materialize: 'lib/materializecss/js/materialize',
        jsRoutes: '/jsRoutes',
        jsCookie: 'lib/js-cookie/js.cookie',
    },
    meta: {
        jquery: {
            format: 'global',
            exports: '$',
        },
        materialize: {
            format: 'global',
            globals: {
                $: 'jquery',
            },
        },
        jsRoutes: {
            format: 'global',
            exports: 'jsRoutes',
        },
    },
});

// hack to make stupid Node modules work in browser
window.process = {env:{NODE_ENV:''}};

System.import('js/AppLauncher.js');
