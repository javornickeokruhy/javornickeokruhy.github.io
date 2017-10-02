/**
 * @author Martin Sznapka
 * @email javornickeokruhy@gmail.com
 * @license Code usage only after author agreement
 */

function loadMap(url, color, markers) {
    var mapElement = $('#map');
    mapElement.height($(window).height());

	var map = new SMap(mapElement.get(0), SMap.Coords.fromWGS84(49.138484,13.664052), 13);
    map.addDefaultControls();
    map.addDefaultLayer(SMap.DEF_BASE);
    map.addDefaultLayer(SMap.DEF_OPHOTO);
    var layer = map.addDefaultLayer(SMap.DEF_SMART_TURIST).enable();
    
    var switchLayer = new SMap.Control.Layer();
    switchLayer.addDefaultLayer(SMap.DEF_BASE);
    switchLayer.addDefaultLayer(SMap.DEF_OPHOTO);
    switchLayer.addDefaultLayer(SMap.DEF_SMART_TURIST);
    map.addControl(switchLayer, {left:'8px', top:'8px'});

    if(markers) {
        var markerLayer = new SMap.Layer.Marker();
        map.addLayer(markerLayer).enable();
        $.each(markers, function(i, marker) {
            insertMarker(markerLayer, marker[0], marker[1]);
        });
    }

    $(switchLayer.getContent()).find('.port').append('<div style="margin:8px 0;"><input type="checkbox" id="trailCheckbox"/> <label for="trailCheckbox" style="display:inline-block;">Turistické trasy</label><br/><input type="checkbox" id="bikeCheckbox"/> <label for="bikeCheckbox" style="display:inline-block;">Cyklotrasy</label></div>');
    
    $('#trailCheckbox').click(function() {
        layer.setTrail($(this).is(':checked'));
    });
    
    $('#bikeCheckbox').click(function() {
        layer.setBike($(this).is(':checked'));
    });
	
	if(url) {
	    $.get(url, insertGpx(map, color));
	}
	else {
        $.get('res/gps/javornickeokruhy-cervena1-traily.gpx', insertGpx(map, '#000000'));
        $.get('res/gps/javornickeokruhy-cervena2-trailova_symfonie.gpx', insertGpx(map, '#CF000C'));
        $.get('res/gps/javornickeokruhy-cervena2-trailova_symfonie_velo.gpx', insertGpx(map, '#CF000C'));
        $.get('res/gps/javornickeokruhy-cervena3-rozhledny.gpx', insertGpx(map, '#F5007B'));
        $.get('res/gps/javornickeokruhy-cervena4-masiv.gpx', insertGpx(map, '#B21B27'));
        $.get('res/gps/javornickeokruhy-cervena5-panorama.gpx', insertGpx(map, '#750015'));
        $.get('res/gps/javornickeokruhy-modra1-architektura.gpx', insertGpx(map, '#010340'));
        $.get('res/gps/javornickeokruhy-modra2-vyhledova.gpx', insertGpx(map, '#0E1E8C'));
        $.get('res/gps/javornickeokruhy-modra3-osmicka.gpx', insertGpx(map, '#0003C7'));
        $.get('res/gps/javornickeokruhy-modra4-koupaci.gpx', insertGpx(map, '#618DD0'));
        $.get('res/gps/javornickeokruhy-modra5-masiv.gpx', insertGpx(map, '#1B4B94'));
	}

    $(window).resize(function() {
        mapElement.height($(window).height());
        map.syncPort();
    });
}

function insertGpx(map, color) { //http://stackoverflow.com/a/939206
	return function(data) {
	    var gpx = new SMap.Layer.GPX(data, null, {maxPoints:5000, colors:[color]});
	    map.addLayer(gpx);
	    gpx.enable();
	    gpx.fit();
	}
}

function insertMarker(layer, gpx, image) {
    var gpx = gpx.split(', ');
    layer.addMarker(new SMap.Marker(SMap.Coords.fromWGS84(gpx[1].replace('E',''), gpx[0].replace('N','')), false, {url:'res/images/arrows/small-track-' + image + '.png', anchor:{left:19,top:19}}));
}

function loadMapTown() {
	var center = SMap.Coords.fromUTM33(402591.70827822783, 5443763.8724913085);
	var map = new SMap($('#map').get(0), center, 11);
	var layer = map.addDefaultLayer(SMap.DEF_SMART_TURIST).enable();
    //layer.setBike(true);
    //layer.setTrail(true);
	map.addDefaultControls();
	map.addControl(new SMap.Control.Overview());
	
	var markerLayer = new SMap.Layer.Marker();
	map.addLayer(markerLayer).enable();
	markerLayer.addMarker(new SMap.Marker(center, 'Javorník', {}));
}
