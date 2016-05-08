var svgDoc;
var svgNS = 'http://www.w3.org/2000/svg';

function resizeBoard(w, h) {
	doc.setAttribute('width', w);
	doc.setAttribute('height', h);
}

function clearBoard() {
	$(doc).empty();
}

function removeHighlight() {
	$('.h').remove();
}

function drawBoard(W, n) {
	var shape = svgDoc.createElementNS(svgNS, "path");
	shape.setAttributeNS(null, "fill", "none");

	var d = "";
	for (var i = 1; i < n; i++) {
		d += "M " + (W * i / n) + " 0" + " L " + (W * i / n) + " " + W + " ";
		d += "M " + "0 " + (W * i / n) + " L " + W + " " + (W * i / n) + " ";
	}

	shape.setAttributeNS(null, "d", d);
	shape.setAttributeNS(null, "stroke-width", strokeWidth);
	shape.setAttributeNS(null, "stroke", colorField);
	doc.appendChild(shape);
}

function highlightO(x, y, r) {
	if ($('.h')[0]) {
		var shape = $('.h')[0];
		shape.setAttributeNS(null, "cx", posToCoord(x));
		shape.setAttributeNS(null, "cy", posToCoord(y));
	} else {
		var shape = svgDoc.createElementNS(svgNS, "circle");
		shape.setAttributeNS(null, "class", "h");
		shape.setAttributeNS(null, "fill", "none");
		shape.setAttributeNS(null, "cx", posToCoord(x));
		shape.setAttributeNS(null, "cy", posToCoord(y));
		shape.setAttributeNS(null, "r", r);
		shape.setAttributeNS(null, "stroke-width", strokeWidth);
		shape.setAttributeNS(null, "stroke", colorO);
		shape.setAttributeNS(null, "stroke-opacity", 0.5);
		doc.appendChild(shape);
	}
}

function drawO(x, y, r) {
	removeHighlight();
	var shape = svgDoc.createElementNS(svgNS, "circle");
	shape.setAttributeNS(null, "fill", "none");
	shape.setAttributeNS(null, "cx", posToCoord(x));
	shape.setAttributeNS(null, "cy", posToCoord(y));
	shape.setAttributeNS(null, "r", r);
	shape.setAttributeNS(null, "stroke-width", strokeWidth);
	shape.setAttributeNS(null, "stroke", colorO);
	doc.appendChild(shape);
}

function highlightX(x, y, r) {
	if ($('.h')[0]) {
		var shape = $('.h')[0];
		var x0 = posToCoord(x);
		var y0 = posToCoord(y);
		
		shape.setAttributeNS(null, "d", "M " + (x0 - r) + " " + (y0 - r) + " L " + (x0 + r) + " " + (y0 + r) + " M " + (x0 + r) + " " + (y0 - r) + " L " + (x0 - r) + " " + (y0 + r));
	} else {
		var shape = svgDoc.createElementNS(svgNS, "path");
		var x0 = posToCoord(x);
		var y0 = posToCoord(y);

		shape.setAttributeNS(null, "class", "h");
		shape.setAttributeNS(null, "fill", "none");
		shape.setAttributeNS(null, "d", "M " + (x0 - r) + " " + (y0 - r) + " L " + (x0 + r) + " " + (y0 + r) + " M " + (x0 + r) + " " + (y0 - r) + " L " + (x0 - r) + " " + (y0 + r));
		shape.setAttributeNS(null, "stroke-width", strokeWidth);
		shape.setAttributeNS(null, "stroke", colorX);
		shape.setAttributeNS(null, "stroke-opacity", 0.5);
		doc.appendChild(shape);
	}
}

function drawX(x, y, r) {
	removeHighlight();
	var shape = svgDoc.createElementNS(svgNS, "path");
	var x0 = posToCoord(x);
	var y0 = posToCoord(y);

	shape.setAttributeNS(null, "fill", "none");
	shape.setAttributeNS(null, "d", "M " + (x0 - r) + " " + (y0 - r) + " L " + (x0 + r) + " " + (y0 + r) + " M " + (x0 + r) + " " + (y0 - r) + " L " + (x0 - r) + " " + (y0 + r));
	shape.setAttributeNS(null, "stroke-width", strokeWidth);
	shape.setAttributeNS(null, "stroke", colorX);
	doc.appendChild(shape);
}

function drawWin(win, O, start, end) {
	removeHighlight();
	var shape = svgDoc.createElementNS(svgNS, "path");
	shape.setAttributeNS(null, "fill", "none");
	shape.setAttributeNS(null, "d", "M " + start[0] + " " + start[1] + " L " + end[0] + " " + end[1]);
	shape.setAttributeNS(null, "stroke-width", strokeWidth);
	shape.setAttributeNS(null, "stroke", 'black');
	doc.appendChild(shape);
}

function drawEnd(win, O, txt) {
	var endRect = svgDoc.createElementNS(svgNS, "rect");
	endRect.setAttributeNS(null, "fill", "white");
	endRect.setAttributeNS(null, "fill-opacity", 0.75);
	endRect.setAttributeNS(null, "x", 0);
	endRect.setAttributeNS(null, "y", 0);
	endRect.setAttributeNS(null, "width", W);
	endRect.setAttributeNS(null, "height", H);
	doc.appendChild(endRect);

	var endText = svgDoc.createElementNS(svgNS, "text");
	endText.setAttributeNS(null, "fill", !win ? 'black' : (O ? colorO : colorX));
	endText.setAttributeNS(null, "font-size", 100);
	endText.setAttributeNS(null, "font-family", "Roboto");
	endText.setAttributeNS(null, "x", W/2);
	endText.setAttributeNS(null, "y", H/2);
	endText.setAttributeNS(null, "text-anchor", "middle");
	endText.setAttributeNS(null, "alignment-baseline", "central");
	endText.textContent = txt;
	doc.appendChild(endText);
}

$( document ).ready(function() {
	doc = $("#svg")[0];
	svgDoc = doc.ownerDocument;
});