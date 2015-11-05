define(['react',
        'reactRouter',
        'javascripts/App',
        'javascripts/views/ContactsPage',
        'javascripts/views/HistoryPage',
        'javascripts/views/MainPage',
        'javascripts/views/ModelsPage',
        'javascripts/views/NewsAndOffersPage',
        'javascripts/views/ServicePage',
        'js/views/ServiceCenters',
        'js/views/ServiceTerms',
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
        'js/components/articles/ArticleUpdatePhotos',
        'js/components/articles/ArticleTextUpdate',
        'js/widgets/ArticleDetailed',
        'js/components/models/ModelsMain',
        'js/components/models/RangesList',
        'js/components/models/ModelStore',
        'js/components/models/ModelEditMenu',
        'js/components/models/ModelEditionsFillForm',
        'js/components/models/ModelUpdate',
        'js/components/models/ModelUpdatePhotos',
        'js/components/models/ModelsList',
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
             ServiceCenters,
             ServiceTerms,
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
             ArticleUpdatePhotos,
             ArticleTextUpdate,
             ArticleDetailed,
             ModelsMain,
             ModelRangesList,
             ModelStore,
             ModelEditMenu,
             ModelEditionsFillForm,
             ModelUpdate,
             ModelUpdatePhotos,
             ModelsList,
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
                    <Route path="/service">
                        <DefaultRoute name="service" handler={ServicePage}/>
                        <Route path="centers" name="service-centers" handler={ServiceCenters}/>
                        <Route path="terms" name="service-terms" handler={ServiceTerms}>
                            <Route path=":articleId" name="service-terms-article" handler={ArticleDetailed}/>
                        </Route>
                    </Route>
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
                            <Route path=":id/update-photos" name="article-update-photos" handler={ArticleUpdatePhotos}/>
                            <Route path=":id/:lang/text-update" name="article-text-update" handler={ArticleTextUpdate}/>
                        </Route>
                        <Route path="models">
                            <Route path="main" name="models-main" handler={ModelsMain}/>
                            <Route path="ranges" name="model-ranges-list" handler={ModelRangesList}/>
                            <Route path="models" name="models-list" handler={ModelsList}/>
                            <Route path="model/store" name="model-store" handler={ModelStore}/>
                            <Route path=":modelId">
                                <Route path="edit-menu" name="model-edit-menu" handler={ModelEditMenu}/>
                                <Route path="update" name="model-update" handler={ModelUpdate}/>
                                <Route path="update-editions" name="model-update-editions" handler={ModelEditionsFillForm}/>
                                <Route path="update-photos" name="model-update-photos" handler={ModelUpdatePhotos}/>
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Route>
        );
    }
);
