function onEachFeature(feature, layer) {
	var popupContent = "<h3>" + feature.properties.routeLabel + " &rarr; " + feature.properties.headsign + "</h3>";
	layer.bindPopup(popupContent);
}

var trafficIcon = L.icon({
	iconUrl: 'icon.svg',
	iconSize: [30, 30],
	iconAnchor: [21, 15],
	popupAnchor: [0, -15]
});

var busIcon = L.icon({
	iconUrl: 'icon_bus.svg',
	iconSize: [30, 30],
	iconAnchor: [21, 15],
	popupAnchor: [0, -15]
});

var nbusIcon = L.icon({
	iconUrl: 'icon_nbus.svg',
	iconSize: [30, 30],
	iconAnchor: [21, 15],
	popupAnchor: [0, -15]
});

var tramIcon = L.icon({
	iconUrl: 'icon_tram.svg',
	iconSize: [30, 30],
	iconAnchor: [21, 15],
	popupAnchor: [0, -15]
});

var trolIcon = L.icon({
	iconUrl: 'icon_trol.svg',
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

var traffic = L.geoJson([], {
	onEachFeature: onEachFeature,

	pointToLayer: function (feature, latlng) {
		console.log(feature.properties.bearing);
		var val = feature.properties.routeLabel;
		var rotate = feature.properties.bearing + 180;
		if (val < 20) {return L.rotatedMarker(latlng, {icon: tramIcon, angle: rotate });} else
		if (val < 40) {return L.rotatedMarker(latlng, {icon: trolIcon, angle: rotate });} else
		if (val < 90) {return L.rotatedMarker(latlng, {icon: busIcon, angle: rotate });} else
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

$.ajax({
dataType: "json",
url: "poloha.geojson",
success: function(data) {
    $(data.features).each(function(key, data) {
        trafficNumbers.addData(data);
        traffic.addData(data);
    });
}
}).error(function() {});

// var trasicka = L.polyline([
// 	[49.2049642, 16.5972086],
// 	[49.2055775, 16.5970050],
// 	[49.2067131, 16.6000303],
// 	[49.2076944, 16.6043006],
// 	[49.2092644, 16.6089997]
// 	], {
// 		color: 'red'
// 	});

// trasicka.bindPopup('Trasa z areálu PřF na křižovatku Pionýrské se Sportovní');

var map = L.map ("map", {
	center: [49.2, 16.6],
	zoom: 16,
	layers: [OSMlayer, trafficNumbers, traffic]
});

var baseLayers = {
	"OpenStreetMap": OSMlayer
};

var overlays = {
	"Hillshade": WMSHillshade,
	"Klad ZM10": KladZM10,
	"Poloha MHD": traffic
	// "Trasa": trasicka
}

L.control.layers(baseLayers, overlays).addTo(map);

function locate() {
	map.locate({
		watch: true,
		setView: true,
		maxZoom: 15
	});	
}

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