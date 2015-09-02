define(['react', 'reactRouter', 'js/components/Navbar', 'js/components/Footer'], function(React, ReactRouter, Navbar, Footer) {

    var RouteHandler = ReactRouter.RouteHandler;

    return React.createClass({
        render: function() {
            return (
                <div>
                    <header>
                        <Navbar/>
                    </header>
                    <main>
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
