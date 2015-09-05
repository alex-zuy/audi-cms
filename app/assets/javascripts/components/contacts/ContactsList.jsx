define(['react', 'reactRouter', 'allMixins', 'mui', 'js/widgets/IconedButton'], function(React, ReactRouter, allMixins, mui, IconedButton) {

    const {Paper} = mui;

    return React.createClass({
        mixins: [
            allMixins.AjaxMixin,
            allMixins.IntlMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.contacts.list',
            };
        },
        getInitialState() {
            return {
                contacts: [],
            };
        },
        render() {
            return (
                <Paper zDepth={2} rounded={false} style={{padding: "50px"}}>
                    <IconedButton
                        linkButton={true}
                        href={this.makeHref('contacts-store', {}, {action:'store'})}
                        label={this.getMsg('actions.addInfo')}
                        iconName='playlist_add'/>
                    <table>
                        <thead>
                            <tr>
                                <td>{this.getMsg('labels.name')}</td>
                                <td>{this.getMsg('labels.internalName')}</td>
                            </tr>
                        </thead>
                        <tbody> {
                            this.state.contacts.map(c =>
                                <tr>
                                    <td>{c.name}</td>
                                    <td>{c.internalName}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </Paper>
            );
        },
        componentWillMount() {
            this.ajax(jsRoutes.controllers.Contacts.list(), {
                success: (contacts) => this.setState({contacts: contacts})
            });
        }
    });
});
