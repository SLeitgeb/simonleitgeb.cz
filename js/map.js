var routeRefCollection = [];
var routeLabelRef = {};
var lastBBox;
var bBoxFactor = 0.5;

function updateFeature() {
	
}

function onEachMarker(feature, layer) {
	var popupContent = "<h3>" + feature.properties.routeLabel + " (" + feature.properties.vehicleId + ")" + " &rarr; " + feature.properties.headsign + "</h3>";
	layer.bindPopup(popupContent);
}

function onEachRoute(feature, layer) {
	var popupContent = "<h3>" + feature['properties']['@relations'][0].reltags.ref + "</h3>";
	layer.bindPopup(popupContent);
}

function toggleRoute(label, cond) {
	var first = routeLabelRef[label][0];
	console.log(first, trafficRoutes._layers[first].options.opacity);
	if (cond) {
		for (var len = routeLabelRef[label].length - 1; len >= 0; len -= 1) {
			var routeId = routeLabelRef[label][len];
			trafficRoutes._layers[routeId].options.opacity = 0;
		}
	} else if (!cond) {
		for (var len = routeLabelRef[label].length - 1; len >= 0; len -= 1) {
			var routeId = routeLabelRef[label][len];
			trafficRoutes._layers[routeId].options.opacity = 1;
		}
	}
	// if (trafficRoutes._layers[first].options.opacity == 1) {
	// 	for (var len = routeLabelRef[label].length - 1; len >= 0; len -= 1) {
	// 		var routeId = routeLabelRef[label][len];
	// 		trafficRoutes._layers[routeId].options.opacity = 0;
	// 	}
	// } else if (trafficRoutes._layers[first].options.opacity == 0) {
	// 	for (var len = routeLabelRef[label].length - 1; len >= 0; len -= 1) {
	// 		var routeId = routeLabelRef[label][len];
	// 		trafficRoutes._layers[routeId].options.opacity = 1;
	// 	}
	// }
}

var trafficIcon = L.icon({
	iconUrl: 'icons/icon.svg',
	iconSize: [30, 30],
	iconAnchor: [21, 15],
	popupAnchor: [0, -15]
});

var busIcon = L.icon({
	iconUrl: 'icons/icon_bus.svg',
	iconSize: [30, 30],
	iconAnchor: [21, 15],
	popupAnchor: [0, -15]
});

var nbusIcon = L.icon({
	iconUrl: 'icons/icon_nbus.svg',
	iconSize: [30, 30],
	iconAnchor: [21, 15],
	popupAnchor: [0, -15]
});

var tramIcon = L.icon({
	iconUrl: 'icons/icon_tram.svg',
	iconSize: [30, 30],
	iconAnchor: [21, 15],
	popupAnchor: [0, -15]
});

var trolIcon = L.icon({
	iconUrl: 'icons/icon_trol.svg',
	iconSize: [30, 30],
	iconAnchor: [21, 15],
	popupAnchor: [0, -15]
});

var positionFeature = L.circleMarker([0, 0], {
		color: '#2FA4E8',
		radius: 8,
		fillOpacity: 0.5,
		clickable: false
	});
	
var accuracyFeature = L.circle([0, 0], 0, {
		color: '#93D9EC',
		fillOpacity: 0.4,
		weight: 2,
		clickable: false
	});

//// Remove OSM layer until I figure out how to render it properly on high density screens.
// var OSMlayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
//     detectRetina: false,
//     // tileSize: 128,
//     reuseTiles: true
// });

var GMaps = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' + (L.Browser.retina ? '&scale=2' : ''),{
    maxZoom: 20,
    detectRetina: false,
    subdomains:['mt0','mt1','mt2','mt3']
});

// var uzavirky = L.tileLayer.wms("http://gis.brno.cz/arcgis/rest/services/PUBLIC/uzavirky/MapServer", {
//     layers: 'Uzavírky (schválené)',
//     format: 'image/png',
//     transparent: false,
//     attribution: "Město Brno"
// });

var trafficMarkers = L.geoJson([], {
	onEachFeature: onEachMarker,

	pointToLayer: function (feature, latlng) {
		// console.log(feature.properties.bearing);
		var val = feature.properties.routeLabel;
		var rotate = feature.properties.bearing + 180;
		if (val < 20) {return L.rotatedMarker(latlng, {icon: tramIcon, angle: rotate });} else
		if (val < 40) {return L.rotatedMarker(latlng, {icon: trolIcon, angle: rotate });} else
		if (val < 89) {return L.rotatedMarker(latlng, {icon: busIcon, angle: rotate });} else
		if (val < 100) {return L.rotatedMarker(latlng, {icon: nbusIcon, angle: rotate });} else
		{return L.rotatedMarker(latlng, {icon: trafficIcon, angle: rotate });}
	}
});

trafficMarkers.getAttribution = function () { return '<a href="http://sotoris.cz/">Šotoris</a>'; };

var trafficNumbers = L.geoJson([], {
	pointToLayer: function (feature, latlng) {
		var trafficNumber = L.divIcon({
			html: "<h5>" + feature.properties.routeLabel + "</h5>",
			iconSize: [18,18],
			iconAnchor: [9,9]
		});

		return L.marker(latlng, {
			icon: trafficNumber,
			clickable: false
		});
	}
});

var traffic = L.layerGroup([trafficMarkers, trafficNumbers]);

var map = L.map ("map", {
	center: [49.195, 16.61],
	zoom: 15,
	zoomControl: false,
	layers: [GMaps, traffic]
});

var baseLayers = {
	// "OpenStreetMap": OSMlayer,
	"Google Maps": GMaps
};

var overlays = {
	"Poloha MHD": traffic,
	// "Uzavírky": uzavirky
	// "Trasy MHD": trafficRoutes
};

var zoom = L.control.zoom({
	position: 'bottomleft'
});

zoom.addTo(map);

//// Layer picker is not needed right now. 
// L.control.layers(baseLayers, overlays).addTo(map);

var trafficRoutes = L.geoJson([], {
	onEachFeature: onEachRoute,

	pointToLayer: function (feature, latlng) {
		var trafficStop = L.icon({
			iconUrl: 'icons/icon_bus_stop.svg',
			iconSize: [20, 20],
			popupAnchor: [0, -10]
		});

		return L.marker(latlng, {
			icon: trafficStop
		});
	},

	style: function(feature) {
		var routeNumber = feature['properties']['@relations'][0].reltags.ref.replace("n", "");
		if (routeRefCollection.indexOf(routeNumber) == -1) {
			routeRefCollection.push(routeNumber);
		}
		if (routeNumber < 20) {return {"color": "#d40000", 'opacity': 0}} else
		if (routeNumber < 40) {return {"color": "#5a2ca0", 'opacity': 0}} else
		if (routeNumber < 89) {return {"color": "#217821", 'opacity': 0}} else
		if (routeNumber < 100) {return {"color": "#000055", 'opacity': 0}}
			else {return {"color": "black", 'opacity': 0}}
	}
});

function parseResponse(data) {
// 	if !trafficMarkers {
// 		$(data.features).each(function(key, data) {
//         	trafficNumbers.addData(data);
//         	trafficMarkers.addData(data);
//     	});
// 	} else {
// 		$(data.features).each(function(key, data) {
// 			trafficMarkers._layers[Object.keys(trafficMarkers._layers)[0]].setLatLng()
// 		});
// 	}
	trafficMarkers.clearLayers();
	trafficNumbers.clearLayers();
	$(data.features).each(function(key, data) {
	    trafficNumbers.addData(data);
    	trafficMarkers.addData(data);
	});
}

function enlargedBBox(bbox, factor) {
	var tempBBox = bbox;
	height = tempBBox._northEast.lat - tempBBox._southWest.lat;
	width = tempBBox._northEast.lng - tempBBox._southWest.lng;
	tempBBox._northEast.lat += factor*height;
	tempBBox._northEast.lng += factor*width;
	tempBBox._southWest.lat -= factor*height;
	tempBBox._southWest.lng -= factor*width;
	return tempBBox;
}

function renderTraffic() {
	var url = '';
	var render = true;
	if (screen.width < 800) {
		var bBox = map.getBounds();
		if (
			bBox._northEast.lat > lastBBox._northEast.lat ||
			bBox._northEast.lng > lastBBox._northEast.lng ||
			bBox._southWest.lat < lastBBox._southWest.lat ||
			bBox._southWest.lng < lastBBox._southWest.lng
			) {
			bBox = enlargedBBox(bBox, bBoxFactor);
			var latmax = bBox._northEast.lat;
			var lngmax = bBox._northEast.lng;
			var latmin = bBox._southWest.lat;
			var lngmin = bBox._southWest.lng;
			url = 'http://bmhdapi-geosimon.rhcloud.com/vehicles.json?latmax=' + latmax + '&lngmax=' + lngmax + '&latmin=' + latmin + '&lngmin=' + lngmin + '&callback=parseResponse';
			lastBBox = bBox;
		} else {
			render = false;
			console.info("Map hasn't moved out of last bounds.");
		}
	} else {
		url = 'http://bmhdapi-geosimon.rhcloud.com/vehicles.json?callback=parseResponse';
	}
	if (render) {
		$.ajax({
			type: "get",
			dataType: "jsonp",
			jsonp: "parseResponse",
			url: url,
			// url: "http://bmhd.simonleitgeb.cz/poloha.json",
			success: function(response) {
				console.log(response);
			},
			complete: function() {
			}
		}).error(function() {});
	}
}

(function renderTraffic() {
	var url = '';
	if (screen.width < 800) {
		var bBox = enlargedBBox(map.getBounds(), bBoxFactor);
		var latmax = bBox._northEast.lat;
		var lngmax = bBox._northEast.lng;
		var latmin = bBox._southWest.lat;
		var lngmin = bBox._southWest.lng;
		url = 'http://bmhdapi-geosimon.rhcloud.com/vehicles.json?latmax=' + latmax + '&lngmax=' + lngmax + '&latmin=' + latmin + '&lngmin=' + lngmin + '&callback=parseResponse';
		lastBBox = bBox;
	} else {
		url = 'http://bmhdapi-geosimon.rhcloud.com/vehicles.json?callback=parseResponse';
	}
	$.ajax({
		type: "get",
		dataType: "jsonp",
		jsonp: "parseResponse",
		url: url,
		// url: "http://bmhd.simonleitgeb.cz/poloha.json",
		success: function(response) {
			console.log(response);
		},
		complete: function() {
			setTimeout(renderTraffic, 5000);
		}
	}).error(function() {});
})();

// (function renderTraffic() {
// 	$.ajax({
// 		dataType: "jsonp",
// 		url: "http://bmhd.simonleitgeb.cz/poloha.json",
// 		success: function(data) {
// 			console.log(data);
// 		},
// 		complete: function() {
// 			setTimeout(renderTraffic, 5000);
// 			// console.log("Rendering traffic again.")
// 		}
// 	}).error(function() {});
// })();

// $.ajax({
// dataType: "json",
// url: "data/routes.geojson",
// success: function(data) {
//     $(data.features).each(function(key, data) {
//         // trafficRoutes.addData(data);
//     });
// },
// complete: function() {
// 		for (var len = Object.keys(trafficRoutes._layers).length - 1; len >= 0; len -= 1) {
// 		// console.log(len, Object.keys(trafficRoutes._layers));
// 		var routeId = Object.keys(trafficRoutes._layers)[len];
// 		var routeLabel = trafficRoutes._layers[routeId].feature.properties["@relations"][0].reltags.ref.replace("n", "");
// 		// console.log(len, ': ', routeId, ', ', routeLabel);
// 		// console.log(!(routeLabel in routeLabelRef));
// 		if (!(routeLabel in routeLabelRef)) {
// 			routeLabelRef[routeLabel] = [];
// 		}
// 		routeLabelRef[routeLabel].push(routeId);
// 		// console.log(routeId);
// 	}
// }
// }).error(function() {});

function toggleGeolocation(event) {
	if (document.getElementById("geolocationSwitch").classList.contains("active")) {
		map.stopLocate();
		map.removeLayer(positionFeature);
		map.removeLayer(accuracyFeature);
		map.off("dragstart", toggleGeolocation);
	} else {
		map.locate({
	  		watch: true,
	  		enableHighAccuracy: true
	  	});
		positionFeature.addTo(map);
		accuracyFeature.addTo(map);
	  	map.on("dragstart", toggleGeolocation);
	}
  	document.getElementById("geolocationSwitch").classList.toggle("active");
}

function locationSuccess(e) {
	map.panTo(e.latlng);
	var radius = e.accuracy / 2;
	positionFeature.setLatLng(e.latlng);
	accuracyFeature.setLatLng(e.latlng);
	accuracyFeature.setRadius(radius);
}

map.on('locationfound', locationSuccess);

document.getElementById("geolocationSwitch").addEventListener("click", toggleGeolocation);

if (screen.width < 800) {
	map.on('moveend', renderTraffic);
}