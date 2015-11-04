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
	return Mod*Math.round(convertDMS(D, M, S)*100000)/100000;
}

function displayCoords() {
	var LatMod = getElement("LatMod").value == -1 ? " j.š." : " s.š.";
	var LonMod = getElement("LonMod").value == -1 ? " z.d." : " v.d.";
	document.getElementById("result").innerHTML = String(Math.abs(parseCoords("Lat"))) + LatMod + "<br>" + String(Math.abs(parseCoords("Lon"))) + LonMod;
}

function getMax(field) {
	if (field == "LatCoordD" || field == "LatRow") {
		return 90;
	} else if (field == "LonCoordD" || field == "LonRow") {
		return 180;
	} else if (['LatCoordM', 'LatCoordS', 'LonCoordM', 'LonCoordS'].indexOf(field) > -1) {
		return 59;
	}
}

function markError(field, bool) {
	field.className = field.className;
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
	var M = getElement(field.substr(0,3) + "CoordM");
	var S = getElement(field.substr(0,3) + "CoordS");
	var rowValidity = validateRow(field.substr(0,3));

	if (!rowValidity) {
		markError(M, M.value != 0);
		markError(S, S.value != 0);
	} else if (rowValidity) {
		markError(M, !validateValue(M.value, 59));
		markError(S, !validateValue(S.value, 59));
	}
	
	markError(getElement(field), !/^[0-9]{1,3}$/.test(getElement(field).value) || !validateValue(getElement(field).value, getMax(field)));
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

	if (errors == "") {
		displayCoords();
	} else {
		document.getElementById("result").innerHTML = errors;
	}
}