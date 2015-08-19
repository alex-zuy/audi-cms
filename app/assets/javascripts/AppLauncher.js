require.config({
    baseUrl: '/assets',
    paths: {
        'react': 'lib/react/dist/react-with-addons',
        'react-draggable2' : 'lib/react-draggable2/dist/react-draggable',
        'classnames' : 'lib/classnames/index',
        'react-router': 'lib/react-router/build/umd/ReactRouter',
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
        Launcher.launch();
        console.log('App launched');
    });
});
