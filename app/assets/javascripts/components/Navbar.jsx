define(['react', 'reactRouter', 'allMixins'], function(React, Router, allMixins) {

    var Link = Router.Link;

    var Item = React.createClass({
        mixins: [
            allMixins.IntlMixin,
        ],
        propTypes: {
            href: React.PropTypes.string.isRequired,
            labelKey: React.PropTypes.string.isRequired,
            linkClassName: React.PropTypes.string,
        },
        getDefaultProps: function() {
            return {
                linkClassName: 'red-text text-darken-4 waves-effect waves-red',
                msgKeyPrefix: 'navbar.labels',
            };
        },
        render: function() {
            return (
                <li>
                    <Link to={this.props.href} className={this.props.linkClassName}>
                        {this.getMsg(this.props.labelKey)}
                    </Link>
                </li>
            );
        }
    });

    var Navbar = React.createClass({
        mixins: [
            allMixins.IntlMixin,
            Router.Navigation,
        ],
        getDefaultProps: function() {
            return {
                msgKeyPrefix: 'navbar.labels',
            };
        },
        render: function() {
            var brandLogoStyle = {
                transform: 'translateX(0%) !important',
                left: 'initial'
            };
            return (
                <div>
                    <div className='navbar-fixed'>
                        <nav>
                            <div className='nav-wrapper grey lighten-4'>
                                <a href='#/main' className='brand-logo right'
                                   style={brandLogoStyle}>
                                    <img src='assets/images/logo-audi.png'/>
                                </a>
                                <a href='#' data-activates='navbar-mobile-items'
                                   ref='collapseButton'
                                   className='button-collapse hide-on-med-and-up'>
                                    <i className='material-icons md-dark'>menu</i>
                                </a>
                                <ul className='left hide-on-small-only'>
                                    <Item href='/main' labelKey='main'/>
                                    <Item href='/news-and-offers' labelKey='newsAndOffers'/>
                                    <Item href='/models' labelKey='models'/>
                                    <li>
                                        <a href={this.makeHref('/service')}
                                           ref='topDropdown'
                                           className='dropdown-button red-text text-darken-4'
                                           data-hover={true}
                                           data-beloworigin={true}
                                           data-activates='navbarTopServiceDropdown'>
                                            {this.getMsg('service')}
                                        </a>
                                        <ul id='navbarTopServiceDropdown'
                                            className='dropdown-content grey lighten-4'>
                                            <Item href='service-centers' labelKey='serviceCenters'/>
                                            <Item href='service-terms' labelKey='serviceTerms'/>
                                        </ul>
                                    </li>
                                </ul>
                                <ul className='side-nav' id='navbar-mobile-items'>
                                    <Item href='/main' labelKey='main'/>
                                    <Item href='/news-and-offers' labelKey='newsAndOffers'/>
                                    <Item href='/models' labelKey='models'/>
                                    <li>
                                        <a href={this.makeHref('/service')}
                                           ref='leftDropdown'
                                           className='dropdown-button red-text text-darken-4'
                                           data-beloworigin={true}
                                           data-activates='navbarLeftServiceDropdown'>
                                            {this.getMsg('service')}
                                        </a>
                                        <ul id='navbarLeftServiceDropdown'
                                            className='dropdown-content grey lighten-4'>
                                            <Item href='service-centers' labelKey='serviceCenters'/>
                                            <Item href='service-terms' labelKey='serviceTerms'/>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            )
        },
        componentDidMount: function() {
            $(React.findDOMNode(this.refs.collapseButton)).sideNav();
            $(React.findDOMNode(this.refs.topDropdown)).dropdown();
            $(React.findDOMNode(this.refs.leftDropdown)).dropdown();
        }
    });

    return Navbar;
});
