define(['react', 'tinymce', 'allMixins'], function(React, tinymce, allMixins) {

    const RPT = React.PropTypes;

    return React.createClass({
        mixins: [
            allMixins.AjaxMixin,
            allMixins.IntlMixin,
        ],
        propTypes: {
            onSave: RPT.func.isRequired,
            onCancel: RPT.func.isRequired,
        },
        getInitialState() {
            return {
                content: '',
                photos: [],
            }
        },
        _editor: null,
        render() {
            return (
                <div>
                    <div ref="textarea" id={this.getEditorId()}></div>
                </div>
            );
        },
        componentDidMount() {
            this.initTinyMce();
        },
        componentWillUnmount() {
            this.removeTinyMce();
        },
        shouldComponentUpdate() {
            return false;
        },
        setPhotoSetAndContent(photoSetId, content) {
            this.ajax(jsRoutes.controllers.Photos.listPhoto(photoSetId), {
                success: (photos) => {
                    this.setState({photos: photos, content: content});
                    this.removeTinyMce();
                    $(React.findDOMNode(this.refs.textarea)).html(content);
                    this.initTinyMce();
                }
            });
        },
        initTinyMce() {
            const images = this.state.photos.map((photo) => ({
                title: this.getPreferedText(photo.name),
                value: jsRoutes.controllers.Photos.showImage(photo.id).url,
            }));

            tinymce.init({
                selector: `#${this.getEditorId()}`,
                inline: false,
                height: 500,
                setup: (editor) => {
                    this._editor = editor;
                },
                plugins: ['image', 'save'].join(' '),
                toolbar: "undo redo | styleselect | bold italic | link image | alignleft aligncenter alignright | save cancel",
                image_list: images,
                save_onsavecallback: this.props.onSave,
                save_oncancelcallback: this.props.onCancel,
            });
        },
        removeTinyMce() {
            tinymce.remove(`#${this.getEditorId()}`);
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
