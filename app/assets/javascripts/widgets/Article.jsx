define(['react', 'allMixins', 'reactRouter', 'mui', 'moment'
], function(React, allMixins, ReactRouter, mui, moment) {

    const {Card, CardHeader, CardMedia, CardActions, CardText, CardTitle} = mui;

    return React.createClass({
        mixins: [
            allMixins.AjaxMixin,
            allMixins.IntlMixin,
        ],
        propTypes: {
            article: React.PropTypes.object.isRequired,
        },
        getInitialState() {
            return {
                photo: null
            }
        },
        render() {
            return (
                <Card style={{margin: '20px'}}>
                    <CardTitle
                        title={this.getPreferedText(this.props.article.title)}
                        subtitle={moment(this.props.article.createdAt).calendar()}/>{(() =>
                        _.isNull(this.state.photo)
                            ? <div/>
                            : <CardMedia
                                overlay={<CardTitle
                                    title={this.getPreferedText(this.state.photo.name)}/>}>
                                  <img src={jsRoutes.controllers.Photos.showImage(this.state.photo.id).url}/>
                              </CardMedia>
                    )()}
                    <CardText>
                        <div dangerouslySetInnerHTML={{__html: this.getPreferedText(this.props.article.text)}}/>
                    </CardText>
                </Card>
            );
        },
        componentDidMount() {
            this.ajax(jsRoutes.controllers.Photos.listPhoto(this.props.article.photoSetId), {
                success: (photos) => {
                    const photo = _.chain(photos).shuffle().first().value();
                    this.setState({photo: photo});
                }
            })
        }
    });
});
