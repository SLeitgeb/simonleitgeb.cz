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
	zoom: 13,
	layers: [OSMlayer]
});

var baseLayers = {
	"OpenStreetMap": OSMlayer
};

var overlays = {
	"Hillshade": WMSHillshade,
	"Klad ZM10": KladZM10,
	// "Trasa": trasicka
}

L.control.layers(baseLayers, overlays).addTo(map);

map.locate({
	watch: true,
	setView: true,
	maxZoom: 15
});

function displayTraffic() {
	$.getJSON("http://sotoris.cz/DataSource/CityHack2015/vehiclesBrno.aspx", function(data) {
		console.log(data);
	});
}

// $.ajax({
//     url: 'http://sotoris.cz/DataSource/CityHack2015/vehiclesBrno.aspx',
//     dataType: "jsonp",
//     jsonp: 'callback',
//     jsonpCallback: 'jsonp_callback'
// });