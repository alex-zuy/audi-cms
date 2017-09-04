import React from 'react';
import ReactRouter from 'react-router';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import LanguageSelect from 'widgets/LanguageSelect';

    var RouteHandler = ReactRouter.RouteHandler;

    export default React.createClass({
        render: function() {
            return (
                <div>
                    <header>
                        <Navbar/>
                    </header>
                    <main>
                        <LanguageSelect/>
                        <div className="container">
                            <RouteHandler/>
                        </div>
                    </main>
                    <Footer/>
                </div>
            );
        }
    });

