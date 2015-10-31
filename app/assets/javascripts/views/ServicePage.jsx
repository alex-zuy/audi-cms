define(['react', 'reactRouter', 'allMixins', 'mui',
    'js/components/TodoDummy',
], function(React, ReactRouter, allMixins, mui, TodoDummy) {

    const {Link} = ReactRouter;
    const {CSSTransitionGroup} = React.addons;

    const linkStyles = {
        fontSize: '160px',
        color: '#000',
    };

    function carouselImageUrls() {
        return [1,2].map(name => `/assets/images/service/${name}.jpg`);
    }

    var ServicePage = React.createClass({
        mixins: [
            allMixins.IntlMixin,
            ReactRouter.Navigation,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'servicePage'
            }
        },
        render: function() {
            return (
                <div>
                    <h2>{this.getMsg('labels.title')}</h2>
                    <div className="row">
                        <div className="col l12 m12">
                            <img src="/assets/images/service/main.png" style={{width: '100%'}}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col offset-m1 m4 offset-l1 l4 center-align">
                            <p>
                                <Link to="service-centers">
                                    <i className="material-icons" style={linkStyles}>build</i>
                                </Link>
                            </p>
                            <h4>{this.getMsg('labels.serviceCenters')}</h4>
                            <p>{this.getMsg('texts.serviceCenters')}</p>
                        </div>
                        <div className="col offset-m2 m4 offset-l2 l4 center-align">
                            <p>
                                <Link to="service-terms">
                                    <i className="material-icons" style={linkStyles}>book</i>
                                </Link>
                            </p>
                            <h4>{this.getMsg('labels.termsOfService')}</h4>
                            <p>{this.getMsg('texts.termsOfService')}</p>
                        </div>
                    </div>
                </div>
            )
        }
    });

    return ServicePage;
});
