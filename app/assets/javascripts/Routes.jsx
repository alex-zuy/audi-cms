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
        'javascripts/components/managers/ManagersList',
        'javascripts/components/managers/ManagerStore',
        'javascripts/components/managers/ManagerUpdate',
        'javascripts/components/managers/ManagerChangePassword',
        'js/components/contacts/ContactsList',
        'js/components/contacts/ContactInfoStore',
        'js/components/contacts/ContactInfoFill',
        'js/components/articles/ArticlesList',
        'js/components/articles/ArticleForm',
        'js/components/articles/ArticleTextUpdate',
        'js/components/models/ModelsMain',
        'js/components/models/RangesList',
        'js/components/photos/PhotoSet',
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
             ManagersList,
             ManagerStore,
             ManagerUpdate,
             ManagerChangePassword,
             ContactsList,
             ContactInfoStore,
             ContactInfoFill,
             ArticlesList,
             ArticleForm,
             ArticleTextUpdate,
             ModelsMain,
             ModelRangesList,
             PhotoSet,
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
                        <Route path="managers">
                            <Route path="list" name="managers-list" handler={ManagersList}/>
                            <Route path="store" name="manager-store" handler={ManagerStore}/>
                            <Route path=":id/update" name="manager-update" handler={ManagerUpdate}/>
                            <Route path=":id/change-password" name="manager-change-password" handler={ManagerChangePassword}/>
                        </Route>
                        <Route path="contacts">
                            <Route path="list" name="contacts-list" handler={ContactsList}/>
                            <Route path="store" name="contacts-store" handler={ContactInfoStore}/>
                            <Route path=":id/update" name="contacts-update" handler={ContactInfoFill}/>
                        </Route>
                        <Route path="articles">
                            <Route path="list" name="articles-list" handler={ArticlesList}/>
                            <Route path="store" name="article-store" handler={ArticleForm}/>
                            <Route path=":id/update" name="article-update" handler={ArticleForm}/>
                            <Route path=":id/:lang/text-update" name="article-text-update" handler={ArticleTextUpdate}/>
                        </Route>
                        <Route path="photoset/:id/update" name="photo-set-update" handler={PhotoSet}/>
                        <Route path="models">
                            <Route path="main" name="models-main" handler={ModelsMain}/>
                            <Route path="ranges" name="model-ranges-list" handler={ModelRangesList}/>
                        </Route>
                    </Route>
                </Route>
            </Route>
        );
    }
);
