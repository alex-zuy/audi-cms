import React from 'react';
import allMixins from 'mixins/allMixins';

export default React.createClass({
    mixins: [
        allMixins.IntlMixin,
    ],
    getDefaultProps: function() {
        return {
            errorKey: null,
            args: null,
        }
    },
    render: function() {
        return (this.props.errorKey != null)
            ? ( <div ref="errors" className="card-panel red lighten-1 white-text">
                    {this.getMsg(this.props.errorKey, this.props.args)}
                </div>)
            : (<div/>);
    },
});
