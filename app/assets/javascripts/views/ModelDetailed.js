import React from 'react';
import ReactRouter from 'react-router';
import allMixins from 'mixins/allMixins';
import mui from 'mui';
import PhotoSetView from 'widgets/PhotoSetView';
import ModelThumbnail from 'widgets/ModelThumbnail';

const {CircularProgress, RaisedButton} = mui;

const characteristicsFields = [
    'passengerCapacity',
    'width',
    'height',
    'length',
    'groundClearance',
    'luggageSpace',
];

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        ReactRouter.Navigation,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'modelDetailedPage'
        }
    },
    getInitialState() {
        return {
            model: null,
        }
    },
    render() {
        return (
            <div>{(() => {
                if(_.isNull(this.state.model)) {
                    return (
                        <div className="row">
                            <div className="col l2 m4 s6">
                                <CircularProgress/>
                            </div>
                        </div>
                    );
                }
                else {
                    const getEnumLabel = (enumName, enumValue) =>
                        this.getIntlMessage(`generic.enumerations.${enumName}.${enumValue}`);
                    const editions = this.state.model.editions;
                    return (
                        <div>
                            <div className="row">
                                <h3>{this.getPreferedText(this.state.model.name)}</h3>
                                <PhotoSetView photoSetId={this.state.model.photoSetId}/>
                            </div>
                            <div className="row">
                                <div className="col l3 hide-on-med-and-down">
                                    <div>
                                        <ModelThumbnail/>
                                        <ModelThumbnail/>
                                    </div>
                                </div>
                                <div className="col l8 offset-l1 m12 s12">
                                    <h5>{this.getMsg('labels.characteristics')}</h5>
                                    <table>
                                        <tbody>{characteristicsFields.map(cs =>
                                            <tr>
                                                <td>{this.getMsg(`labels.characteristicsFields.${cs}`)}</td>
                                                <td>{this.state.model[cs]}</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                    <RaisedButton
                                        linkButton={true}
                                        href={this.makeHref('test-drive')}
                                        label={this.getMsg('actions.arrangeTestDrive')}
                                        primary={true}/>
                                    <h5>{this.getMsg('labels.editions')}</h5>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>{this.getMsg('labels.feature')}</th>{editions.map(edition =>
                                                    <th>{this.getPreferedText(edition.name)}</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.engineType')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{getEnumLabel('engineTypes', edition.engineType)}</td>
                                                    )
                                                }
                                            </tr>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.engineVolume')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{edition.engineVolume}</td>
                                                    )
                                                }
                                            </tr>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.engineCylinderCount')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{edition.engineCylinderCount}</td>
                                                    )
                                                }
                                            </tr>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.enginePower')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{edition.enginePower}</td>
                                                    )
                                                }
                                            </tr>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.fuelTank')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{edition.fuelTank}</td>
                                                    )
                                                }
                                            </tr>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.fuelConsumption')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{edition.fuelConsumption}</td>
                                                    )
                                                }
                                            </tr>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.acceleration')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{edition.acceleration}</td>
                                                    )
                                                }
                                            </tr>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.maxSpeed')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{edition.maxSpeed}</td>
                                                    )
                                                }
                                            </tr>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.gearboxType')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{getEnumLabel('gearboxTypes', edition.gearboxType)}</td>
                                                    )
                                                }
                                            </tr>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.gearboxLevels')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{edition.gearboxLevels}</td>
                                                    )
                                                }
                                            </tr>
                                            <tr>
                                                <td>{this.getMsg('labels.editionsFields.transmissionType')}</td>{
                                                    editions.map((edition) =>
                                                            <td>{getEnumLabel('transmissionTypes', edition.transmissionType)}</td>
                                                    )
                                                }
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="row hide-on-large-only">
                                <hr/>{[1,2,3].map(index =>
                                <div key={`index-${index}`} className="col m4 s6">
                                    <ModelThumbnail/>
                                </div>
                            )}
                            </div>
                        </div>
                    );
                }
            })()}
            </div>
        );
    },
    componentDidMount() {
        this.loadModel(this.props.params.modelId);
    },
    componentWillReceiveProps(props) {
        this.loadModel(props.params.modelId);
    },
    loadModel(id) {
        this.ajax(jsRoutes.controllers.Models.showModelDetailed(id), {
            success: (model) => this.setState({model: model})
        });
    }
});
