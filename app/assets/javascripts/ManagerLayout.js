import React from 'react';
import ReactRouter from 'react-router';
import Navbar from 'components/Navbar';

var RouteHandler = ReactRouter.RouteHandler;

export default React.createClass({
    render: function() {
        return (
            <div>
                <header>
                    <Navbar/>
                </header>
                <RouteHandler/>
            </div>
        );
    }
})
