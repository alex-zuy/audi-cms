import React from 'react';
import ReactRouter from 'react-router';
import allMixins from 'mixins/allMixins';
import mui from 'mui';

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
    ],
    getDefaultProps() {
        return {
            msgKeyPrefix: 'controlPanel.testDrives'
        }
    },
    getInitialState() {
        return {
            testDrives: [],
        }
    },
    render() {
        return (
            <div>
                <h4>{this.getMsg('labels.testDrive')}</h4>
                <ul className="collection">{ this.state.testDrives.map(td =>
                    <li className="collection-item avatar">
                        <a href="" onClick={this.onClick.bind(this, td.id)}>
                            <i className="material-icons circle red">delete</i>
                        </a>
                        <span className="title">{this.getPreferedText(td.model.name)}</span>
                        <p>{this.getMsg('labels.modelEdition')} : <b>{this.getPreferedText(td.modelEdition.name)}</b><br/>
                            {this.getMsg('labels.fullName')} : <b>{td.clientFullName}</b><br/>
                            {this.getMsg('labels.email')} : <b>{td.clientEmail}</b><br/>
                            {this.getMsg('labels.number')} : <b>{td.clientNumber}</b>
                        </p>
                    </li>
                )}
                </ul>
            </div>
        );
    },
    componentDidMount() {
        this.loadItems();
    },
    loadItems() {
        this.ajax(jsRoutes.controllers.TestDrives.list(), {
            success: (all) => this.setState({testDrives: all})
        });
    },
    onClick(id, e) {
        e.preventDefault();
        this.ajax(jsRoutes.controllers.TestDrives.delete(id), {
            success: () => this.loadItems()
        })
    }
});
