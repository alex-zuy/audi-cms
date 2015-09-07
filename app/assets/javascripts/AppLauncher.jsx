define(['react', 'reactRouter', 'js/Routes', 'jquery', 'underscore', 'jsCookie', 'react-tap-event-plugin', 'materialize', 'jsRoutes'], function(React, ReactRouter, routes, $, _, jsCookie, injectTapEventPlugin) {

    injectTapEventPlugin();

    function launchApp(messages) {

        ReactRouter.run(routes, ReactRouter.HashLocation, function(App) {
            React.render(<App locale={getLocale()} messages={messages}/>, document.body);
        });

        console.log('App launched');
    }

    function getLocale() {
        var maybeLocale = jsCookie.get('lang');
        return maybeLocale ? maybeLocale : 'en';
    }

    $(function() {
        var route = jsRoutes.controllers.Application.translations();
        $.ajax({ url: route.url, success:launchApp });
    });
});
