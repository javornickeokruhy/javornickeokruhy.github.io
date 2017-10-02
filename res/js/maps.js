/**
 * @author Martin Sznapka
 * @email javornickeokruhy@gmail.com
 * @license Code usage only after author agreement
 */

function loadMap(mapConfig, gpxConfig) {
    var mapElement = mapConfig.mapElement;
    mapElement.height($(window).height());

    var map = new SMap(mapElement.get(0), coordination(mapConfig.center), mapConfig.zoom);
    map.addDefaultControls();
    
    var layerSwitch = new SMap.Control.Layer();
    map.addControl(layerSwitch, {left:'8px', top:'8px'});
    
    var markerLayer = new SMap.Layer.Marker();
    map.addLayer(markerLayer).enable();
    
    var defaultLayer = null;
    
    $.each(mapConfig.layers, function(index, layer) {
        var l = map.addDefaultLayer(layer);
        layerSwitch.addDefaultLayer(layer);
        
        if(index === 0)
            defaultLayer = l.enable();
    });

    if(mapConfig.touristCheckboxes) {
        var input = insertCheckbox(null, 'Turistické trasy', false);
        input.change(function() {
            defaultLayer.setTrail($(this).is(':checked'));
        });
        
        input = insertCheckbox(null, 'Cyklotrasy', false);
        input.change(function() {
            defaultLayer.setBike($(this).is(':checked'));
        });
    }

    map.gpxList = {};
    
    $.each(gpxConfig, function(index, gpx) {
        $.get(gpx.url, insertGpx(map, gpx.color, gpx.title, gpx.checkbox, gpx.fit));
        
        if(gpx.markers) {
            $.each(gpx.markers, function(index, marker) {
                insertMarker(markerLayer, marker[0], marker[1]);
            });
        }
    });

    $(window).resize(function() {
        mapElement.height($(window).height());
        map.syncPort();
    });
}

function insertGpx(map, color, title, checkbox, fit) {
    return function(data) {
        var gpx = new SMap.Layer.GPX(data, null, {maxPoints:5000, colors:[color]});
        map.addLayer(gpx);
        gpx.enable();
        
        if(fit)
            gpx.fit();
        
        if(!checkbox)
            return;

        if(map.gpxList.hasOwnProperty(title)) {
            map.gpxList[title].push(gpx);
        }
        else {
            map.gpxList[title] = [gpx];

            var input = insertCheckbox(null, title, true);
            input.change(function() {
                $.each(map.gpxList[title], function(i, gpx) {
                    gpx[input.is(':checked') ? 'enable' : 'disable']();
                });
            });
        }
    }
}

function coordination(coordString) {
    var coord = coordString.split(', ');
    return SMap.Coords.fromWGS84(coord[1].replace('E',''), coord[0].replace('N',''));
}

function insertMarker(layer, coordString, image) {
    var imagePath = typeof image === 'string' ? image : 'arrows/small-track-' + image + '.png';
    layer.addMarker(new SMap.Marker(coordination(coordString), false, {url:'/res/img/' + imagePath, anchor:{left:19,top:19}}));
}

function insertCheckbox(id, title, checked) {
    id = id ? ' id="' + id + '"' : '';
    checked = checked ? ' checked' : '';
    
    var checkboxContainer = $('#checkboxContainer');
    if(!checkboxContainer.length) {
        $('.layer-switch').after('<div class="layer-switch"><div id="checkboxContainer" class="window"></div></div>');
        checkboxContainer = $('#checkboxContainer');
    }
    
    var checkbox = $('<label><input type="checkbox"' + id + checked + '/> ' + title + '</label><br/>');
    
    checkboxContainer.append(checkbox);
    
    return checkbox.find('input');
}