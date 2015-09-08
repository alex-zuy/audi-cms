define(['react', 'allMixins', 'mui'], function(React, allMixins, mui) {

    const {Dialog} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
        ],
        propTypes: {
            onConfirm: React.PropTypes.func,
            onCancel: React.PropTypes.func,
        },
        getDefaultProps() {
            return {
                msgKeyPrefix: 'components.confirmDialog',
            };
        },
        render() {
            const dialogContent = [
                {text: this.getMsg('actions.cancel'), onTouchTap: this.onCancel},
                {text: this.getMsg('actions.confirm'), onTouchTap: this.onConfirm, ref: 'confirm'}
            ];
            return <Dialog
                ref="dialog"
                actions={dialogContent}
                modal={true}
                actionFocus="confirm"
                {...this.props}/>
        },
        show() {
            this.refs.dialog.show();
        },
        dismiss() {
            this.refs.dialog.dismiss();
        },
        onConfirm() {
            this.refs.dialog.dismiss();
            if(_.isFunction(this.props.onConfirm)) this.props.onConfirm();
        },
        onCancel() {
            this.refs.dialog.dismiss();
            if(_.isFunction(this.props.onCancel)) this.props.onCancel();
        },
    });
});