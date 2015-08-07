define(['react', 'react-router'], function(React, Router) {

    var Link = Router.Link;

    var Item = React.createClass({
        propTypes: {
            href: React.PropTypes.string.isRequired,
            labelKey: React.PropTypes.string.isRequired,
            linkClassName: React.PropTypes.string,
        },
        getDefaultProps: function() {
            return {linkClassName: 'red-text text-darken-4 waves-effect waves-red'};
        },
        render: function() {
            return (
                <li>
                    <Link to={this.props.href} className={this.props.linkClassName}>
                        {this.props.labelKey}
                    </Link>
                </li>
            );
        }
    });

    var Navbar = React.createClass({
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
                                    <Item href='/main' labelKey='key.main'/>
                                    <Item href='/news-and-offers' labelKey='key.newsAndOffers'/>
                                    <Item href='/models' labelKey='key.models'/>
                                    <li>
                                        <a href='#'
                                           ref='topDropdown'
                                           className='dropdown-button red-text text-darken-4'
                                           data-hover={true}
                                           data-beloworigin={true}
                                           data-activates='navbarTopServiceDropdown'>
                                            key.service
                                        </a>
                                        <ul id='navbarTopServiceDropdown'
                                            className='dropdown-content grey lighten-4'>
                                            <Item href='/service' labelKey='one'/>
                                            <Item href='/service' labelKey='two'/>
                                            <Item href='/service' labelKey='three'/>
                                            <li className='divider'></li>
                                            <Item href='/service' labelKey='four'/>
                                        </ul>
                                    </li>
                                </ul>
                                <ul className='side-nav' id='navbar-mobile-items'>
                                    <Item href='/main' labelKey='key.main'/>
                                    <Item href='/news-and-offers' labelKey='key.newsAndOffers'/>
                                    <Item href='/models' labelKey='key.models'/>
                                    <li>
                                        <a href='#'
                                           ref='leftDropdown'
                                           className='dropdown-button red-text text-darken-4'
                                           data-beloworigin={true}
                                           data-activates='navbarLeftServiceDropdown'>
                                            key.service
                                        </a>
                                        <ul id='navbarLeftServiceDropdown'
                                            className='dropdown-content grey lighten-4'>
                                            <Item href='/service' labelKey='one'/>
                                            <Item href='/service' labelKey='two'/>
                                            <Item href='/service' labelKey='three'/>
                                            <li className='divider'></li>
                                            <Item href='/service' labelKey='four'/>
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
