document.convertor.LatCoordD.select();

function getElement(name) {
	return document.getElementById("convertor").elements[name];
}

function autoTab(origin, dest) {
	if (origin.value.length == origin.maxLength) {
		dest.select();
	}
}

function convertDMS(D, M, S) {
	return parseInt(D) + parseInt(M)/60 + parseInt(S)/3600;
}

function parseCoords(axis) {
	var D = getElement(axis + "CoordD").value;
	var M = getElement(axis + "CoordM").value;
	var S = getElement(axis + "CoordS").value;
	var Mod = getElement(axis + "Mod").value;
	return Mod*Math.round(convertDMS(D, M, S)*100000)/100000;
}

function displayCoords() {
	var LatMod = getElement("LatMod").value == -1 ? " j.š." : " s.š.";
	var LonMod = getElement("LonMod").value == -1 ? " z.d." : " v.d.";
	var Lat = parseCoords("Lat");
	var Lon = parseCoords("Lon");
	var bottom = Lat - 0.025;
	var left = Lon - 0.0375;
	var top = Lat + 0.025;
	var right = Lon + 0.0375;
	document.getElementById("result").innerHTML = String(Math.abs(Lat)) + LatMod + "<br>" + String(Math.abs(Lon)) + LonMod;
	document.getElementById("gmapsPlot").style.visibility = "visible";
	document.getElementById("gmapsPlot").href = "https://maps.google.com/maps/?q=" + String(Lat) + "," + String(Lon);
	if (Lat > 48.55 && Lat < 51.06 && Lon > 12.09 && Lon < 18.87) {
		document.getElementById("wmsPlot").src = "http://geoportal.cuzk.cz/WMS_ZM50_PUB/service.svc/get?LAYERS=GR_ZM50&TRANSPARENT=TRUE&FORMAT=image%2Fpng&VERSION=1.3.0&EXCEPTIONS=XML&SERVICE=WMS&REQUEST=GetMap&STYLES=&CRS=EPSG%3A4326&_OLSALT=0.1830467802938074&BBOX=" + bottom + "," + left + "," + top + "," + right + "&WIDTH=500&HEIGHT=500";
		document.getElementById("wmsPlot").style.display = "block";
	} else {
		document.getElementById("wmsPlot").style.display = "none";
	}
}

function getMax(name) {
	if (name == "LatCoordD" || name == "LatRow") {
		return 90;
	} else if (name == "LonCoordD" || name == "LonRow") {
		return 180;
	} else if (['LatCoordM', 'LatCoordS', 'LonCoordM', 'LonCoordS'].indexOf(name) > -1) {
		return 59;
	}
}

function markError(field, bool) {
	// field.className = field.className;
	if (bool) {
		field.className = field.className.indexOf('error') == -1 ? field.className += " error" : field.className;
	} else {
		field.className = field.className.indexOf('error') != -1 ? field.className.replace(" error", "") : field.className;
	}
}

function validateValue(value, max) {
	return value >= 0 && value <= max;
}

function validateField(field) {
	var M = getElement(field.name.substr(0,3) + "CoordM");
	var S = getElement(field.name.substr(0,3) + "CoordS");
	var rowValidity = validateRow(field.name.substr(0,3));

	if (!rowValidity) {
		markError(M, M.value != 0);
		markError(S, S.value != 0);
	} else if (rowValidity) {
		markError(M, !validateValue(M.value, 59));
		markError(S, !validateValue(S.value, 59));
	}

	markError(field, !/^[0-9]{1,3}$/.test(field.value) || !validateValue(field.value, getMax(field.name)));

	// var M = getElement(field.substr(0,3) + "CoordM");
	// var S = getElement(field.substr(0,3) + "CoordS");
	// var rowValidity = validateRow(field.substr(0,3));

	// if (!rowValidity) {
	// 	markError(M, M.value != 0);
	// 	markError(S, S.value != 0);
	// } else if (rowValidity) {
	// 	markError(M, !validateValue(M.value, 59));
	// 	markError(S, !validateValue(S.value, 59));
	// }

	// markError(getElement(field), !/^[0-9]{1,3}$/.test(getElement(field).value) || !validateValue(getElement(field).value, getMax(field)));
}

function validateRow(row) {
	var D = getElement(row + "CoordD");
	var M = getElement(row + "CoordM");
	var S = getElement(row + "CoordS");
	return (D.value == getMax(row + "CoordD") && M.value == 0 && S.value == 0) || D.value < getMax(row + "CoordD")
}

function validateForm() {
	var errors = "";
	var LatD = getElement("LatCoordD").value;
	var LatM = getElement("LatCoordM").value;
	var LatS = getElement("LatCoordS").value;
	var LonD = getElement("LonCoordD").value;
	var LonM = getElement("LonCoordM").value;
	var LonS = getElement("LonCoordS").value;

	errors += (!validateRow("Lat")) ? "Zeměpisná šířka nesmí být větší než 90°.<br>" : "";
	errors += (!validateRow("Lon")) ? "Zeměpisná délka nesmí být větší než 180°.<br>" : "";
	errors += (!validateValue(LatM, 59) || !validateValue(LonM, 59)) ? "Minuty musí být menší než 60'.<br>" : "";
	errors += (!validateValue(LatS, 59) || !validateValue(LonS, 59)) ? "Sekundy musí být menší než 60\".<br>" : "";
	errors += (!/^[0-9]{1,3}$/.test(LatD)) ? "Souřadnice mohou obsahovat pouze celá čísla." : "";
	errors += (!/^[0-9]{1,3}$/.test(LatM)) ? "Souřadnice mohou obsahovat pouze celá čísla." : "";
	errors += (!/^[0-9]{1,3}$/.test(LatS)) ? "Souřadnice mohou obsahovat pouze celá čísla." : "";
	errors += (!/^[0-9]{1,3}$/.test(LonD)) ? "Souřadnice mohou obsahovat pouze celá čísla." : "";
	errors += (!/^[0-9]{1,3}$/.test(LonM)) ? "Souřadnice mohou obsahovat pouze celá čísla." : "";
	errors += (!/^[0-9]{1,3}$/.test(LonS)) ? "Souřadnice mohou obsahovat pouze celá čísla." : "";

	if (errors == "") {
		document.getElementById("result").className = document.getElementById("result").className.indexOf("error") != -1 ? document.getElementById("result").className.replace(" error", "") : document.getElementById("result").className;
		displayCoords();
	} else {
		document.getElementById("gmapsPlot").style.visibility = "hidden";
		document.getElementById("wmsPlot").style.display = "none";
		document.getElementById("result").innerHTML = errors;
		document.getElementById("result").className += document.getElementById("result").className.indexOf("error") == -1 ? " error" : "";
	}
}