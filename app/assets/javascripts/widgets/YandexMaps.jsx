define(['react', 'ymaps'], function(React, ymaps) {
    return React.createClass({
        getDefaultProps() {
            return {
                id: generateId(),
                width: 600,
                height: 300,
            };
        },
        render() {
            return (
                <div
                    id={this.props.id}
                    style={{
                        width: this.props.width+"px",
                        height: this.props.height+"px",
                        marginLeft: 'auto',
                        marginRight: 'auto'
                        }}/>
            );
        },
        ymap: null,
        componentDidMount() {
            this.ymap = new ymaps.Map(this.props.id, {
                center: [55.76, 37.64],
                zoom: 10,
            });
        },
        componentWillUnmount() {
            this.ymap.destroy();
        },
        shouldComponentUpdate() {
            return false;
        }
    });

    function generateId() {
        return `map-${new Date().getTime()}`;
    }
});
