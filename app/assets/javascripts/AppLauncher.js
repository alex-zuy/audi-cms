require.config({
    baseUrl: '/assets',
    paths: {
        'react': 'lib/react/dist/react',
        'react-router': 'lib/react-router/build/umd/ReactRouter'
    }
});

requirejs(['javascripts/ReactRouterLauncher'], function(Launcher) {
    $(function() {
        Launcher.launch();
        console.log('App launched');
    });
});
