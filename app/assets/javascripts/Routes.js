import React from 'react';
import ReactRouter from 'react-router';
import App from 'App';
import ContactsPage from 'views/ContactsPage';
import HistoryPage from 'views/HistoryPage';
import MainPage from 'views/MainPage';
import ModelsPage from 'views/ModelsPage';
import NewsAndOffersPage from 'views/NewsAndOffersPage';
import ServicePage from 'views/ServicePage';
import ServiceCenters from 'views/ServiceCenters';
import ServiceTerms from 'views/ServiceTerms';
import SiteMapPage from 'views/SiteMapPage';
import TestDrivePage from 'views/TestDrivePage';
import LoginPage from 'views/LoginPage';
import ControlPanelPage from 'views/ControlPanelPage';
import ManagersList from 'components/managers/ManagersList';
import ManagerStore from 'components/managers/ManagerStore';
import ManagerUpdate from 'components/managers/ManagerUpdate';
import ManagerChangePassword from 'components/managers/ManagerChangePassword';
import ContactsList from 'components/contacts/ContactsList';
import ContactInfoStore from 'components/contacts/ContactInfoStore';
import ContactInfoFill from 'components/contacts/ContactInfoFill';
import ArticlesList from 'components/articles/ArticlesList';
import ArticleForm from 'components/articles/ArticleForm';
import ArticleUpdatePhotos from 'components/articles/ArticleUpdatePhotos';
import ArticleTextUpdate from 'components/articles/ArticleTextUpdate';
import ArticleDetailed from 'widgets/ArticleDetailed';
import ModelsMain from 'components/models/ModelsMain';
import ModelRangesList from 'components/models/RangesList';
import ModelStore from 'components/models/ModelStore';
import ModelEditMenu from 'components/models/ModelEditMenu';
import ModelEditionsFillForm from 'components/models/ModelEditionsFillForm';
import ModelUpdate from 'components/models/ModelUpdate';
import ModelUpdatePhotos from 'components/models/ModelUpdatePhotos';
import ModelsList from 'components/models/ModelsList';
import ModelDetailed from 'views/ModelDetailed';
import TestDrives from 'components/testDrives/TestDrives';
import PhotoSet from 'components/photos/PhotoSet';
import UserLayout from 'UserLayout';
import ManagerLayout from 'ManagerLayout';

const {Route, DefaultRoute} = ReactRouter;

export default (
    <Route handler={App}>
        <Route handler={UserLayout}>
            <Route path="/main" handler={MainPage}/>
            <Route path="/news-and-offers" handler={NewsAndOffersPage}/>
            <Route path="/models">
                <DefaultRoute name="models" handler={ModelsPage}/>
                <Route path=":modelId" name="model-detailed" handler={ModelDetailed}/>
            </Route>
            <Route path="/service">
                <DefaultRoute name="service" handler={ServicePage}/>
                <Route path="centers" name="service-centers" handler={ServiceCenters}/>
                <Route path="terms" name="service-terms" handler={ServiceTerms}>
                    <Route path=":articleId" name="service-terms-article" handler={ArticleDetailed}/>
                </Route>
            </Route>
            <Route path="/history" handler={HistoryPage}/>
            <Route path="/contacts" handler={ContactsPage}/>
            <Route path="/test-drive" name="test-drive" handler={TestDrivePage}/>
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
                <Route path="test-drives" name="test-drives-ctl" handler={TestDrives}/>
            </Route>
        </Route>
    </Route>
);
