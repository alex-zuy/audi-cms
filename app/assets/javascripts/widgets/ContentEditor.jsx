define(['react', 'tinymce'], function(React, tinymce) {

    const RPT = React.PropTypes;

    return React.createClass({
        propTypes: {
            images: RPT.arrayOf(RPT.shape({
                title: RPT.string.isRequired,
                value: RPT.string.isRequired,
            })),
            content: RPT.string,
            onSave: RPT.func.isRequired,
            onCancel: RPT.func.isRequired,
        },
        getDefaultProps() {
            return { content: '' };
        },
        _editor: null,
        render() {
            return (
                <div>
                    <textarea id={this.getEditorId()}>{this.props.content}</textarea>
                </div>
            );
        },
        componentDidMount() {
            tinymce.init({
                selector: `#${this.getEditorId()}`,
                inline: false,
                height: 500,
                setup: (editor) => {
                    this._editor = editor;
                },
                plugins: ['image', 'save'].join(' '),
                toolbar: "undo redo | styleselect | bold italic | link image | alignleft aligncenter alignright | save cancel",
                image_list: this.props.images,
                save_onsavecallback: this.props.onSave,
                save_oncancelcallback: this.props.onCancel,
            });
        },
        componentWillUnmount() {
            tinymce.remove(`#${this.getEditorId()}`);
        },
        shouldComponentUpdate() {
            return false;
        },
        setContent(content) {
            this._editor.setContent(content, {format: 'html'});
        },
        getContent() {
            return this._editor.getContent({format : 'html'});
        },
        getEditorId() {
            if(_.isUndefined(this._editorId)) {
                this._editorId = generateId();
            }
            return this._editorId;
        }
    });

    function generateId() {
        return 'tinymce-editor-' + new Date().getTime();
    }
});
