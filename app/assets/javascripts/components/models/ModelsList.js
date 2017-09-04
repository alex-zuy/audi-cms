import React from 'react';
import allMixins from 'mixins/allMixins';
import ReactRouter from 'react-router';
import IconedButton from 'widgets/IconedButton';

const {Link} = ReactRouter;

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        ReactRouter.Navigation,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.models.list'
        }
    },
    getInitialState() {
        return {
            models: [],
        }
    },
    render() {
        return (
            <div>
                <h4>{this.getMsg('labels.models')}</h4>
                <div className="collection">{
                    this.state.models.map((model) =>
                        <Link className="collection-item" to="model-edit-menu" params={{modelId: model.id}}>
                            {this.getPreferedText(model.name)}
                        </Link>
                    )
                }
                </div>
                <IconedButton
                    iconName="playlist_add"
                    label={this.getMsg('actions.add')}
                    href={this.makeHref('model-store')}
                    linkButton={true}/>
            </div>
        );
    },
    componentWillMount() {
        this.ajax(jsRoutes.controllers.Models.listModels(), {
            success: (models) => this.setState({models: models})
        });
    },
});
