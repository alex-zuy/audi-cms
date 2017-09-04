import React from 'react';
import allMixins from 'mixins/allMixins';
import ReactRouter from 'react-router';
import mui from 'mui';
import IconedButton from 'widgets/IconedButton';

const {Navigation} = ReactRouter;

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        Navigation,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.models.editMenu'
        }
    },
    render() {
        const urlParam = {modelId: this.props.params.modelId};
        return (
            <div>
                <h4>{this.getMsg('labels.editingModel')}</h4>
                <h6>{this.getMsg('labels.editModel')}</h6>
                <IconedButton
                    iconName="subject"
                    label={this.getMsg('actions.editModel')}
                    linkButton={true}
                    href={this.makeHref('model-update', urlParam)}/>
                <h6>{this.getMsg('labels.editEditions')}</h6>
                <IconedButton
                    iconName="view_list"
                    label={this.getMsg('actions.editEditions')}
                    linkButton={true}
                    href={this.makeHref('model-update-editions', urlParam)}/>
                <h6>{this.getMsg('labels.editPhotos')}</h6>
                <IconedButton
                    iconName="photo_library"
                    label={this.getMsg('actions.editPhotos')}
                    linkButton={true}
                    href={this.makeHref('model-update-photos', urlParam)}/>
            </div>
        );
    },
});
