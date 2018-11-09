function drawFreeHand() {

    poly = new google.maps.Polyline({ map: map, clickable: false });

    var move = google.maps.event.addListener(map, 'mousemove', function(e) {
        poly.getPath().push(e.latLng);
    });

    google.maps.event.addListenerOnce(map, 'mouseup', function(e) {
        google.maps.event.removeListener(move);
        var path = poly.getPath();
        poly.setMap(null);


        var theArrayofLatLng = path.getArray();
        var ArrayforPolygontoUse = GDouglasPeucker(theArrayofLatLng, 50);
        console.log("ArrayforPolygontoUse", ArrayforPolygontoUse);


        var polyOptions = {
            map: map,
            fillColor: '#0099FF',
            fillOpacity: 0.7,
            strokeColor: '#AA2143',
            strokeWeight: 2,
            clickable: false,
            zIndex: 1,
            path: ArrayforPolygontoUse,
            editable: false
        }

        poly = new google.maps.Polygon(polyOptions);
        addToFirebase(ArrayforPolygontoUse);

        google.maps.event.clearListeners(map.getDiv(), 'mousedown');

        enable()
    });
}

function initialize() {
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(52.5498783, 13.425209099999961),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    //draw
    $("#draw a").click(function(e) {
        e.preventDefault();
        console.log("draws");

        disable()

        google.maps.event.addDomListener(map.getDiv(), 'mousedown', function(e) {
            drawFreeHand()
        });

    });
}

function disable() {
    map.setOptions({
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: false
    });
}

function enable() {
    map.setOptions({
        draggable: true,
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: true
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
