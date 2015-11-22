var routeRefCollection = [];

var routeLabelRef = {};

function onEachMarker(feature, layer) {
	var popupContent = "<h3>" + feature.properties.routeLabel + " &rarr; " + feature.properties.headsign + "</h3>";
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

var OSMlayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var WMSHillshade = L.tileLayer.wms("http://geoportal.cuzk.cz/WMS_TEREN/WMService.aspx", {
	layers: 'GR_TEREN',
	format: 'image/png',
	transparent: true,
	opacity: 0.3
});

var KladZM10 = L.tileLayer.wms("http://geoportal.cuzk.cz/WMS_KLADY/WMService.aspx", {
	layers: 'GP_ZM10',
	format: 'image/png',
	transparent: true
});

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

(function renderTraffic() {
	$.ajax({
		dataType: "json",
		url: "http://bmhd.simonleitgeb.cz/poloha.json",
		success: function(data) {
			trafficMarkers.clearLayers();
			trafficNumbers.clearLayers();
		    $(data.features).each(function(key, data) {
		        trafficNumbers.addData(data);
		        trafficMarkers.addData(data);
		    });
		},
		complete: function() {
			setTimeout(renderTraffic, 5000);
			console.log("Rendering traffic again.")
		}
	}).error(function() {});
})();

$.ajax({
dataType: "json",
url: "data/routes.geojson",
success: function(data) {
    $(data.features).each(function(key, data) {
        trafficRoutes.addData(data);
    });
},
complete: function() {
		for (var len = Object.keys(trafficRoutes._layers).length - 1; len >= 0; len -= 1) {
		// console.log(len, Object.keys(trafficRoutes._layers));
		var routeId = Object.keys(trafficRoutes._layers)[len];
		var routeLabel = trafficRoutes._layers[routeId].feature.properties["@relations"][0].reltags.ref.replace("n", "");
		// console.log(len, ': ', routeId, ', ', routeLabel);
		// console.log(!(routeLabel in routeLabelRef));
		if (!(routeLabel in routeLabelRef)) {
			routeLabelRef[routeLabel] = [];
		}
		routeLabelRef[routeLabel].push(routeId);
		// console.log(routeId);
	}
}
}).error(function() {});

var map = L.map ("map", {
	center: [49.2, 16.6],
	zoom: 16,
	layers: [OSMlayer, traffic]
});

var baseLayers = {
	"OpenStreetMap": OSMlayer
};

var overlays = {
	"Hillshade": WMSHillshade,
	"Klad ZM10": KladZM10,
	"Poloha MHD": traffic,
	// "Trasy MHD": trafficRoutes
	// "Trasa": trasicka
};

L.control.layers(baseLayers, overlays).addTo(map);

function locate() {
	map.locate({
		watch: true,
		setView: true,
		maxZoom: 15
	});	
};

// L.circleMarker([49.20301, 16.64184], {
// 	radius: 3
// }).addTo(map);

// map.panTo([49.20301, 16.64184]);

// $.ajax({
//     url: 'http://sotoris.cz/DataSource/CityHack2015/vehiclesBrno.aspx',
//     dataType: "jsonp",
//     jsonp: 'callback',
//     jsonpCallback: 'jsonp_callback'
// });