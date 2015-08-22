define(['react',
        'react-router',
        'javascripts/App',
        'javascripts/components/TodoDummy',
        'javascripts/views/ContactsPage',
        'javascripts/views/HistoryPage',
        'javascripts/views/MainPage',
        'javascripts/views/ModelsPage',
        'javascripts/views/NewsAndOffersPage',
        'javascripts/views/ServicePage',
        'javascripts/views/SiteMapPage',
        'javascripts/views/TestDrivePage',
        'javascripts/views/LoginPage',
        'javascripts/views/ControlPanelPage',
    ],
    function(React,
             ReactRouter,
             App,
             TodoDummy,
             ContactsPage,
             HistoryPage,
             MainPage,
             ModelsPage,
             NewsAndOffersPage,
             ServicePage,
             SiteMapPage,
             TestDrivePage,
             LoginPage,
             ControlPanelPage)
    {

        var Route = ReactRouter.Route;

        return {
            launch: function(locale, messages) {
                var routes = (
                    <Route handler={App}>
                        <Route path="/main" handler={MainPage}/>
                        <Route path="/news-and-offers" handler={NewsAndOffersPage}/>
                        <Route path="/models" handler={ModelsPage}/>
                        <Route path="/service" handler={ServicePage}/>
                        <Route path="/history" handler={HistoryPage}/>
                        <Route path="/contacts" handler={ContactsPage}/>
                        <Route path="/test-drive" handler={TestDrivePage}/>
                        <Route path="/site-map" handler={SiteMapPage}/>
                        <Route path="/login" name="login" handler={LoginPage}/>
                        <Route path="/control-panel" name="control-panel" handler={ControlPanelPage}/>
                    </Route>
                );

                ReactRouter.run(routes, ReactRouter.HashLocation, function(App) {
                    React.render(<App locale={locale} messages={messages}/>, document.body);
                });

                console.log('React router launched');
            }
        }
    }
);
