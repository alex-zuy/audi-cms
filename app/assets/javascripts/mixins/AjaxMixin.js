function propDefined(obj, propName) {
    return typeof obj[propName] !== "undefined"
}

function appendIfDefined(dest, source, propName) {
    if(propDefined(source, propName)) {
        dest[propName] = source[propName];
    }
}

export default {
    ajax: function(route, options) {

        var ajaxOptions = {
            method: route.type,
            url: PUBLIC_URL + route.url,
            contentType: 'text/json',
        };

        ajaxOptions.data = JSON.stringify(propDefined(options, 'data') ? options.data : {});

        ['complete', 'success', 'error'].forEach(function(propName) {
            appendIfDefined(ajaxOptions, options, propName);
        });

        $.ajax(ajaxOptions);
    }
}
