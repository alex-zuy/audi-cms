import React from 'react';
import ReactRouter from 'react-router';
import allMixins from 'mixins/allMixins';
import mui from 'mui';

const {CSSTransitionGroup} = React.addons;
const {Card, CardTitle, Paper} = mui;

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
        allMixins.AjaxMixin,
        ReactRouter.Navigation,
    ],
    getInitialState() {
        return {
            ranges: [],
        }
    },
    render() {
        return (
            <div className="ranges-list-container center-align">
                <ul>{ this.state.ranges.map((range, index, all) =>
                    <li key={`range-${index}`} className="range" style={{width: `${100.0 / all.length}%`}}>
                        <a href={this.makeHref('models', {}, {modelRangeId: range.id})} className="black-text">
                            {this.getPreferedText(range.name)}
                        </a>
                    </li>
                    )
                }
                </ul>
            </div>
        );
    },
    componentDidMount() {
        this.ajax(jsRoutes.controllers.Models.listRanges(), {
            success: (ranges) => this.setState({ranges: ranges})
        });
    }
});
