var LatMod = 1;
var LonMod = 1;
var LatCoordD;
var LatCoordM;
var LatCoordS;
var LonCoordD;
var LonCoordM;
var LonCoordS;
var resultLat;
var resultLon;
var err;

function getElement(name) {
	return document.getElementById("form").elements[name];
}

function convertDMS(D, M, S) {
	return parseInt(D) + parseInt(M)/60 + parseInt(S)/3600;
}

function parseCoords() {
	LatCoordD = getElement("LatCoordD").value;
	LatCoordM = getElement("LatCoordM").value;
	LatCoordS = getElement("LatCoordS").value;
	LonCoordD = getElement("LonCoordD").value;
	LonCoordM = getElement("LonCoordM").value;
	LonCoordS = getElement("LonCoordS").value;
	LatMod = getElement("LatMod").value;
	LonMod = getElement("LonMod").value;
	var LatCoordDMS = String(Math.round(convertDMS(LatCoordD, LatCoordM, LatCoordS)*100000)/100000);
	var LonCoordDMS = String(Math.round(convertDMS(LonCoordD, LonCoordM, LonCoordS)*100000)/100000);
	resultLat = LatMod == -1 ? LatCoordDMS + " j.š." : LatCoordDMS + " s.š.";
	resultLon = LonMod == -1 ? LonCoordDMS + " z.d." : LonCoordDMS + " v.d.";
	document.getElementById("result").innerHTML = resultLat + "<br>" + resultLon;
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