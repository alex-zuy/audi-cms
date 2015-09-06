define(['react', 'ymaps', 'js/widgets/YandexMaps'], function(React, ymaps, YandexMaps) {
    return React.createClass({
        getInitialState() {
            return {
                value: null,
            };
        },
        render() {
            return (<YandexMaps ref="map"/>);
        },
        placemark: null,
        componentDidMount() {
            if(this.state.value) {
                this.placemark = new ymap.Placemark(this.state.value);
                this.refs.map.ymap.geoObjects.add(this.placemark);
            }
            this.getMap().events.add('click', this.onMapClicked, this);
        },
        getMap() {
            return this.refs.map.ymap;
        },
        onMapClicked(e) {
            const coords = e.get('coords');
            console.log(coords);
            if(this.placemark == null) {
                this.createPlacemark(coords);
            }
            else {
                this.placemark.geometry.setCoordinates(coords);
            }
        },
        createPlacemark(coords) {
            this.placemark = new ymaps.Placemark(coords);
            this.getMap().geoObjects.add(this.placemark);
            this.placemark.events.add('dblclick', (e) => {
                e.preventDefault();
                this.removePlacemark();
            });
        },
        removePlacemark() {
            this.getMap().geoObjects.remove(this.placemark);
            this.placemark = null;
        },
        isEmpty() {
            return this.placemark == null;
        },
        setValue(coords) {
            if(this.placemark == null) {
                this.createPlacemark(coords);
            }
            else {
                this.placemark.geometry.setCoordinates(coords)
            }
        },
        getValue() {
            if(this.placemark == null) {
                return null;
            }
            else {
                return this.placemark.geometry.getCoordinates();
            }
        }
    });
});
