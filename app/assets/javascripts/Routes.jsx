define(['react',
        'reactRouter',
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
        'javascripts/components/managers/ManagersList',
        'javascripts/components/managers/ManagerStore',
        'javascripts/components/managers/ManagerUpdate',
        'javascripts/components/managers/ManagerChangePassword',
        'js/components/contacts/ContactsList',
        'js/components/contacts/ContactInfoForm',
        'js/components/contacts/ContactInfoFillForm',
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
             ManagerUpdate,
             ManagerChangePassword,
             ContactsList,
             ContactInfoForm,
             ContactInfoFillForm,
             UserLayout,
             ManagerLayout)
    {
        const {Route, DefaultRoute} = ReactRouter;

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
                        <DefaultRoute handler={ManagersControl}/>
                        <Route path="managers" handler={ManagersControl}>
                            <Route path="list" name="managers-list" handler={ManagersList}/>
                            <Route path="store" name="manager-store" handler={ManagerStore}/>
                            <Route path=":id/update" name="manager-update" handler={ManagerUpdate}/>
                            <Route path=":id/change-password" name="manager-change-password" handler={ManagerChangePassword}/>
                        </Route>
                        <Route path="contacts">
                            <Route path="list" name="contacts-list" handler={ContactsList}/>
                            <Route path="store" name="contacts-store" handler={ContactInfoForm}/>
                            <Route path=":id/update" name="contacts-update" handler={ContactInfoFillForm}/>
                        </Route>
                    </Route>
                </Route>
            </Route>
        );
    }
);
