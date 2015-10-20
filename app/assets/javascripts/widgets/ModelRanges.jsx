define(['react', 'reactRouter', 'allMixins', 'mui'], function(React, ReactRouter, allMixins, mui) {

    const {CSSTransitionGroup} = React.addons;
    const {Card, CardTitle, Paper} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
        ],
        getInitialState() {
            return {
                ranges: [],
            }
        },
        render() {
            return (
                <div className="ranges-list-container center-align">
                    <ul>{ this.state.ranges.map((range, index) =>
                        <li key={`range-${index}`} className="range">
                            <p>{this.getPreferedText(range.name)}</p>
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
});
