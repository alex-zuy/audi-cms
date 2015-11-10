define(['react', 'reactRouter',
    'js/components/Navbar',
    'js/components/Footer',
    'js/widgets/LanguageSelect',
], function(React, ReactRouter, Navbar, Footer, LanguageSelect) {

    var RouteHandler = ReactRouter.RouteHandler;

    return React.createClass({
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
});
