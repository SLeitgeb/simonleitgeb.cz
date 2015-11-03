function getElement(name) {
	return document.getElementById("convertor").elements[name];
}

function convertDMS(D, M, S) {
	return parseInt(D) + parseInt(M)/60 + parseInt(S)/3600;
}

function parseCoords(axis) {
	var D = getElement(axis + "CoordD").value;
	var M = getElement(axis + "CoordM").value;
	var S = getElement(axis + "CoordS").value;
	var Mod = getElement(axis + "Mod").value;
	var DMS = String(Math.round(convertDMS(D, M, S)*100000)/100000);
	var dir;
	if (axis == "Lat") {
		dir = Mod -1 ? " j.š." : " s.š.";
	} else {
		dir = Mod -1 ? " z.d." : " v.d.";
	}
	return DMS + dir;
}

function displayCoords() {
	document.getElementById("result").innerHTML = parseCoords("Lat") + "<br>" + parseCoords("Lon");
}

function getMax(field) {
	if (field == "LatCoordD" || field == "LatRow") {
		return 90;
	} else if (field == "LonCoordD" || field == "LonRow") {
		return 180;
	} else if (['LatCoordM', 'LatCoordS', 'LonCoordM', 'LonCoordS'].indexOf(field) > -1) {
		return 60;
	}
}

function validateValue(value, max) {
	return value >= 0 && value <= max;
}

function validateField(field) {
	var maxValue = getMax(field);
	var element = getElement(field);
	var validValue = validateValue(element.value, maxValue);
	var D = getElement(field.substr(0, 8) + "D");
	var M = getElement(field.substr(0, 8) + "M");
	var S = getElement(field.substr(0, 8) + "S");
	var validValues = validateValue(D.value, getMax(field.substr(0, 8) + "D")) && validateValue(M.value, 60) && validateValue(S.value, 60);
	var validRow = validValues && validateValue(convertDMS(D.value, M.value, S.value), getMax(field.substr(0, 3) + "Row"))
	if (!validValue && element.className.indexOf('error') == -1) {
		element.className += " error";
	} else if (validValue && element.className.indexOf('error') != -1) {
		element.className = element.className.replace(" error", "");
	}
	if (validValues && !validRow) {
		M.className = (M.value != 0 && M.className.indexOf('error') == -1) ? M.className + " error" : M.className;
		S.className = (S.value != 0 && S.className.indexOf('error') == -1) ? S.className + " error" : S.className;
	} else if (validRow) {
		D.className = (D.className.indexOf('error') != -1) ? D.className.replace(" error", "") : D.className;
		M.className = (M.className.indexOf('error') != -1) ? M.className.replace(" error", "") : M.className;
		S.className = (S.className.indexOf('error') != -1) ? S.className.replace(" error", "") : S.className;
	}
}