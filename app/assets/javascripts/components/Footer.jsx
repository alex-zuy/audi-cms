define(['react', 'reactRouter', 'allMixins', 'js/widgets/IconedButton'], function(React, ReactRouter, allMixin, IconedButton) {

    const {Link} = ReactRouter;

    return React.createClass({
        mixins: [
            allMixin.IntlMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'footer',
            };
        },
        render() {
            return (
                <footer className="page-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col l6 s12">
                                <h5 className="white-text">Footer Content</h5>
                            </div>
                        </div>
                    </div>
                    <div className="footer-copyright">
                        <div className="container">
                            &copy; {new Date().getFullYear()} Audi
                            <Link className="grey-text text-lighten-4 right" to="control-panel">
                                {this.getMsg('labels.controlPanel')}
                            </Link>
                        </div>
                    </div>
                </footer>
            );
        }
    });
});
