import $ from 'jquery';
import jsCookie from 'js-cookie';
import _ from 'underscore-es/_index';
import 'materialize-css/dist/js/materialize.min';
// import 'materialize-css/dist/css/materialize.min.css';
import 'custom.scss';
import 'flag-icons.scss';

import React from 'react';
import ReactRouter from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import routes from 'Routes';

window._ = _;

injectTapEventPlugin();

function launchApp(localeData) {

    ReactRouter.run(routes, ReactRouter.HashLocation, function(App) {
        React.render(<App locale={getLocale()} localeData={localeData}/>, document.getElementById('reactContent'));
    });

    console.log('App launched');
}

function getLocale() {
    var maybeLocale = jsCookie.get('lang');
    return maybeLocale ? maybeLocale : 'en';
}

$(function() {
    var route = jsRoutes.controllers.Application.localeData();
    $.ajax({ url: PUBLIC_URL + route.url, success:launchApp });
});

