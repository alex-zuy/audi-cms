define(function() {

    function propDefined(obj, propName) {
        return typeof obj[propName] !== "undefined"
    }

    function appendIfDefined(dest, source, propName) {
        if(propDefined(source, propName)) {
            dest[propName] = source[propName];
        }
    }

    return {
        ajax: function(route, options) {

            var ajaxOptions = {
                method: route.type,
                url: route.url,
                contentType: 'text/json',
            };

            if(propDefined(options, 'data')) {
                ajaxOptions.data = JSON.stringify(options.data);
            }

            ['complete', 'success', 'error'].forEach(function(propName) {
                appendIfDefined(ajaxOptions, options, propName);
            });

            $.ajax(ajaxOptions);
        }
    }
});
