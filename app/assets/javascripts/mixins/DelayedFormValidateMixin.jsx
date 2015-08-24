define(['react'], function(React) {

    return {
        propTypes: {
            delayedFormValidateMixin: React.PropTypes.shape({
                delay: React.PropTypes.number.isRequired,
            }).isRequired,
        },
        _lastChanged: null,
        _wasValidated: false,
        onFormChangedCallback: function() {
            this._lastChanged = new Date();
            this._wasValidated = false;
        },
        componentDidMount: function() {
            this._lastChanged = new Date();
            setInterval(function() {
                var now = new Date();
                if(!this._wasValidated && now.getTime() - this._lastChanged.getTime() > this.props.delayedFormValidateMixin.delay) {
                    this._wasValidated = true;
                    this.validateForm();
                }
            }.bind(this), 100);
        }
    }
});
