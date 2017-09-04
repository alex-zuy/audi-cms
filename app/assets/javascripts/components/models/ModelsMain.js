import React from 'react';
import allMixins from 'mixins/allMixins';
import ReactRouter from 'react-router';
import mui from 'mui';

const {RaisedButton} = mui;

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        ReactRouter.Navigation,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.models.main'
        }
    },
    render() {
        return (
            <div>
                <h4>{this.getMsg('labels.models')}</h4>
                <hr/>
                <h6>{this.getMsg('labels.manageRanges')}</h6>
                <RaisedButton
                    linkButton={true}
                    href={this.makeHref('model-ranges-list')}
                    label={this.getMsg('actions.manageRanges')}/>
                <hr/>
                <h6>{this.getMsg('labels.manageModels')}</h6>
                <RaisedButton
                    linkButton={true}
                    href={this.makeHref('models-list')}
                    label={this.getMsg('actions.manageModels')}/>
            </div>
        );
    }
});
