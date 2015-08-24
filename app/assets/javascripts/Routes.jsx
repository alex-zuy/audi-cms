define(['react',
        'react-router',
        'javascripts/App',
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
        'javascripts/views/ManagersControl',
        'javascripts/components/ManagersList',
        'javascripts/components/ManagerStore',
        'javascripts/components/ManagerChangePassword',
        'javascripts/UserLayout',
        'javascripts/ManagerLayout',
    ],
    function(React,
             ReactRouter,
             App,
             ContactsPage,
             HistoryPage,
             MainPage,
             ModelsPage,
             NewsAndOffersPage,
             ServicePage,
             SiteMapPage,
             TestDrivePage,
             LoginPage,
             ControlPanelPage,
             ManagersControl,
             ManagersList,
             ManagerStore,
             ManagerChangePassword,
             UserLayout,
             ManagerLayout)
    {
        var Route = ReactRouter.Route;

        return (
            <Route handler={App}>
                <Route handler={UserLayout}>
                    <Route path="/main" handler={MainPage}/>
                    <Route path="/news-and-offers" handler={NewsAndOffersPage}/>
                    <Route path="/models" handler={ModelsPage}/>
                    <Route path="/service" handler={ServicePage}/>
                    <Route path="/history" handler={HistoryPage}/>
                    <Route path="/contacts" handler={ContactsPage}/>
                    <Route path="/test-drive" handler={TestDrivePage}/>
                    <Route path="/site-map" handler={SiteMapPage}/>
                    <Route path="/login" name="login" handler={LoginPage}/>
                </Route>
                <Route path="/control-panel" name="control-panel" handler={ManagerLayout}>
                    <Route handler={ControlPanelPage}>
                        <Route path="managers" handler={ManagersControl}>
                            <Route path="list" name="managers-list" handler={ManagersList}/>
                            <Route path="store" name="manager-store" handler={ManagerStore}/>
                            <Route path=":id/change-password" name="manager-change-password" handler={ManagerChangePassword}/>
                        </Route>
                    </Route>
                </Route>
            </Route>
        );
    }
);
