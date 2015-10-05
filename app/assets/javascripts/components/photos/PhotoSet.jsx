define(['react', 'allMixins', 'mui',
    'js/inputs/inputs',
    'js/components/ErrorPanel',
    'js/components/ConfirmDialog',
], function(React, allMixins, mui, inputs, ErrorPanel, ConfirmDialog) {

    const RPT = React.PropTypes;
    const {HiddenInput, I18nTextInput} = inputs;
    const {Toolbar, ToolbarGroup, RaisedButton, Paper, IconButton} = mui;

    const PhotoForm = React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.FormMixin,
            allMixins.AjaxMixin,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.photos.form',
                photoId: null,
                formMixin: {
                    fieldRefs: ['name', 'photoSetId', 'mimeType'],
                    validateRoute: () => jsRoutes.controllers.Photos.validatePhotoHeaders(),
                    validateDelay: 800,
                }
            }
        },
        getInitialState() {
            return {
                error: null,
                fileObjectURL: null,
                previousImageURL: null,
                mimeType: '',
            }
        },
        render() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: '15px'}}>
                    <h4>{this.getMsg('labels.photo')}</h4>
                    <div className="photoForm">
                        <div className="form">
                            <form onChange={this.onFormChangeValidate}>
                                <I18nTextInput
                                    ref="name"
                                    floatingLabelText={this.getMsg('inputs.name.label')}
                                    hintText={this.getMsg('inputs.name.placeholder')}/>
                                <HiddenInput ref="photoSetId" value={parseInt(this.props.photoSetId)}/>
                                <HiddenInput ref="mimeType" value={this.state.mimeType}/>
                            </form>
                            <RaisedButton
                                onClick={this.onSubmit}
                                label={this.getMsg('actions.submit')}
                                disabled={!(this.state.formMixin.fieldsValid && this.isFileChosen())}
                                primary={true}
                                style={{marginTop: '20px'}}/>
                        </div>
                        <div className="imageSelect">
                            <input
                                ref="imageSelect"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={this.fileChosen}
                                style={{display:'none'}}/>
                            <ErrorPanel errorKey={this.state.error}/>
                            {(this.isFileChosen())
                                ? (<img src={_.compact([this.state.fileObjectURL, this.state.previousImageURL])[0]} onClick={this.selectFile}/>)
                                : (
                                <div onClick={this.selectFile} className="imagePlaceholder grey lighten-3">
                                    <div>
                                        <i className="material-icons">insert_photo</i>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Paper>
            );
        },
        componentDidMount() {
            this.checkPhotoIdAndFillForm(this.props.photoId);
        },
        componentWillReceiveProps(props) {
            this.checkPhotoIdAndFillForm(props.photoId);
        },
        checkPhotoIdAndFillForm(photoId) {
            if(!_.isNull(photoId)) {
                this.loadItem(jsRoutes.controllers.Photos.showHeaders(photoId), () => this.onFormChangeValidate());
                this.setState({previousImageURL: jsRoutes.controllers.Photos.showImage(photoId).url});
            }
        },
        isFileChosen() {
            return !_.isNull(this.state.fileObjectURL) || !_.isNull(this.state.previousImageURL);
        },
        onSubmit() {
            if(_.isNull(this.props.photoId)) {
                this.submitForm(jsRoutes.controllers.Photos.storePhotoHeaders(), {
                    success: (response) => this.sendImage(response.id, () => {
                        this.props.onImageSubmited();
                    })
                });
            }
            else {
                this.submitForm(jsRoutes.controllers.Photos.updateHeaders(this.props.photoId), {
                    success: () => {
                        if(_.isNull(this.state.fileObjectURL)) this.props.onImageSubmited();
                        else this.sendImage(this.props.photoId, () => this.props.onImageSubmited());
                    }
                })
            }
        },
        sendImage(photoId, callback) {
            const route = jsRoutes.controllers.Photos.uploadImage(photoId);
            const request = new XMLHttpRequest();
            request.open(route.type, route.url, true);
            request.onload = () => callback();
            request.send(this.getChosenFiles()[0]);
        },
        selectFile() {
            $(React.findDOMNode(this.refs.imageSelect)).click();
        },
        getChosenFiles() {
            return React.findDOMNode(this.refs.imageSelect).files;
        },
        fileChosen() {
            if(!_.isNull(this.state.fileObjectURL)) {
                window.URL.revokeObjectURL(this.state.fileObjectURL);
                this.setState({fileObjectURL: null});
            }

            const chosenFiles = this.getChosenFiles();
            if(_.isEmpty(chosenFiles)) {
                this.setState({error: null});
            }
            else if(!isImage(chosenFiles[0])) {
                this.setState({
                    error: 'controlPanel.PhotoSet.errors.fileIsNotImage',
                });
            }
            else {
                const file = chosenFiles[0];
                this.setState({
                    fileObjectURL: window.URL.createObjectURL(file),
                    mimeType: file.type,
                    error: null,
                });
            }
        }
    });

    function isImage(file) {
        return file.type.indexOf('image/') === 0;
    }

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.photos'
            }
        },
        getInitialState() {
            return {
                photos: [],
                isFormOpen: false,
                photoInFormId: null,
                photoToDelete: null,
            }
        },
        render() {
            return (
                <Paper zDepth={4} rounded={false} style={{padding: '20px'}}>
                    <h4>{this.getMsg('labels.photoSet')}</h4>
                    {(this.state.isFormOpen)
                        ? (
                        <PhotoForm
                            onImageSubmited={this.imageSubmited}
                            photoSetId={this.props.params.id}
                            photoId={this.state.photoInFormId}/>
                        ) : (
                        <RaisedButton
                            onClick={this.addPhotoClicked}
                            label={this.getMsg('actions.add')}
                            disabled={this.state.isFormOpen}/>
                    )}
                    <hr/>
                    <div zDepth={3} rounded={false} style={{padding: '15px'}}>
                        <div className="photoSet">
                            {this.state.photos.map((photo) =>
                                <div key={`photo-${photo.id}`} className="photoSetImage grey lighten-2 z-depth-3">
                                    <img src={getTimestampedImageUrl(photo.id)} className="responsive-img"/>
                                    <div className="controls">
                                        <span>{this.getPreferedText(photo.name)}</span>
                                        <br/>
                                        <IconButton
                                            onClick={this.editPhoto.bind(this, photo.id)}
                                            iconClassName="material-icons">mode_edit</IconButton>
                                        <IconButton
                                            onClick={this.deletePhoto.bind(this, photo.id)}
                                            iconClassName="material-icons">delete</IconButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <ConfirmDialog
                        ref="dialog"
                        onConfirm={this.confirmDeletePhoto}
                        onCancel={this.cancelDeletePhoto}>
                        {this.getMsg('labels.confirmDelete')}
                    </ConfirmDialog>
                </Paper>
            );
        },
        componentWillMount() {
            this.loadPhotos();
        },
        loadPhotos() {
            this.ajax(jsRoutes.controllers.Photos.listPhoto(this.props.params.id), {
                success: (photos) => this.setState({photos: photos}),
            });
        },
        editPhoto(id) {
            this.openForm(id);
        },
        deletePhoto(id) {
            this.setState({photoToDelete: id});
            this.refs.dialog.show();
        },
        confirmDeletePhoto() {
            if(this.state.photoInFormId == this.state.photoToDelete) {
                this.closeForm();
            }
            this.ajax(jsRoutes.controllers.Photos.delete(this.state.photoToDelete), {
                complete: () => this.loadPhotos()
            });
            this.setState({photoToDelete: null});
        },
        cancelDeletePhoto() {
            this.setState({photoToDelete: null});
        },
        closeForm() {
            this.setState({
                isFormOpen: false,
                photoInFormId: null,
            });
        },
        openForm(id = null) {
            this.setState({
                isFormOpen: true,
                photoInFormId: id,
            });
        },
        imageSubmited() {
            this.closeForm();
            this.loadPhotos();
        },
        addPhotoClicked() {
            this.openForm();
        }
    });

    function getTimestampedImageUrl(photoId) {
        return jsRoutes.controllers.Photos.showImage(photoId).url + `?timestamp=${new Date().getTime()}}`;
    }
});
