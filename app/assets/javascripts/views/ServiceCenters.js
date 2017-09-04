import React from 'react';
import allMixins from 'mixins/allMixins';
import mui from 'mui';
import ymaps from 'ymaps';
import YandexMaps from 'widgets/YandexMaps';

const {CircularProgress} = mui;

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'servicePage',
        }
    },
    getInitialState() {
        return {
            contactInfos: null,
        }
    },
    render() {
        return (
            <div>
                <h1>{this.getMsg('labels.serviceCenters')}</h1>
                <div>{(() => {
                    if (_.isNull(this.state.contactInfos)) {
                        return (<CircularProgress mode="indeterminate"/>);
                    }
                    else {
                        return (
                            <div>{(() => {
                                if(this.isAnyServiceCenterMarkedOnMap()) {
                                    return <YandexMaps ref="map"/>;
                                }
                                else {
                                    return <div></div>;
                                }
                                })()}
                                {_.sortBy(this.getServiceCentersContactInfos(), ci => this.getPreferedText(ci.name)).map(ci =>
                                    <ul className="collection with-header">
                                        <li className="collection-header"><h5>{this.getPreferedText(ci.name)}</h5></li>
                                        {_.sortBy(ci.addresses, a => this.getPreferedText(a.name)).map(address =>
                                            <li className="collection-item avatar">
                                                <i className="material-icons circle green">place</i>
                                                <span className="title">{this.getPreferedText(address.name)}</span>
                                                <p>{address.address}</p>
                                            </li>
                                        )}
                                        {_.sortBy(ci.emails, a => this.getPreferedText(a.name)).map(email =>
                                            <li className="collection-item avatar">
                                                <i className="material-icons circle orange">email</i>
                                                <span>{this.getPreferedText(email.name)}</span>
                                                <p>{email.email}</p>
                                            </li>
                                        )}
                                        {_.sortBy(ci.numbers, n => this.getPreferedText(n.name)).map(number =>
                                            <li className="collection-item avatar">
                                                <i className="material-icons circle blue">phone</i>
                                                <span>{this.getPreferedText(number.name)}</span>
                                                <p>{number.number}</p>
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        );
                    }
                })()}
                </div>
            </div>
        );
    },
    componentDidMount() {
        this.ajax(jsRoutes.controllers.Contacts.listDetailed(), {
            success: (ci) => {
                this.setState({contactInfos: ci}, () => {
                    if(this.isAnyServiceCenterMarkedOnMap()) {
                        this.markServiceCentersOnMap()
                    }
                });
            }
        });
    },
    markServiceCentersOnMap() {
        const map = this.getMap();
        this.getServiceCentersAddresses().map(address => {
            if(!_.isNull(address.geoCoordinates)) {
                map.geoObjects.add(new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: address.geoCoordinates,
                    },
                    properties: {
                        iconContent: this.getPreferedText(address.name),
                        hintContent: address.address,
                    },
                },
                {
                    preset: 'islands#blackStretchyIcon',
                }));
            }
        });
    },
    getMap() {
        return this.refs.map.ymap;
    },
    isAnyServiceCenterMarkedOnMap() {
        return this.getServiceCentersAddresses().some(ca => !_.isNull(ca.geoCoordinates));
    },
    getServiceCentersAddresses() {
        return _.flatten(this.getServiceCentersContactInfos().map(_.property('addresses')), true);
    },
    getServiceCentersContactInfos() {
        return _.where(this.state.contactInfos, {category: 'service'});
    }
});
