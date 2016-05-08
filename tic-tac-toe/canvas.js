var context;
var lastState;
var removeHighlight = restoreState;

function resizeBoard(w, h) {
	doc.width = w; doc.height = h;
}

function clearBoard() {
	context.clearRect(0, 0, W, H);
}

function saveState() {
	lastState = context.getImageData(0, 0, W, H);
}

function restoreState() {
	context.putImageData(lastState, 0, 0);
}

function drawBoard(W, n) {
	context.strokeStyle = colorField;
	context.lineWidth = strokeWidth;

	context.beginPath();
	for (var i = 1; i < n; i++) {
		context.moveTo(W * i / n, 0);
		context.lineTo(W * i / n, W);
		context.moveTo(0, W * i / n);
		context.lineTo(W, W * i / n);
	}
	context.closePath();
	context.stroke();
	saveState();
}

function highlightO(x, y, r) {
	restoreState();
	context.globalAlpha = 0.5;
	context.strokeStyle = colorO;
	context.lineWidth = strokeWidth;

	context.beginPath();
	context.arc(posToCoord(x), posToCoord(y), r, 2*Math.PI, false);
	context.closePath();
	context.stroke();
}

function drawO(x, y, r) {
	restoreState();
	context.globalAlpha = 1;
	context.strokeStyle = colorO;
	context.lineWidth = strokeWidth;

	context.beginPath();
	context.arc(posToCoord(x), posToCoord(y), r, 2*Math.PI, false);
	context.closePath();
	context.stroke();
	saveState();
}

function highlightX(x, y, r) {
	restoreState();
	context.globalAlpha = 0.5;
	context.strokeStyle = colorX;
	context.lineWidth = strokeWidth;
	var x0 = posToCoord(x);
	var y0 = posToCoord(y);

	context.beginPath();
	context.moveTo(x0 - r, y0 - r);
	context.lineTo(x0 + r, y0 + r);
	context.moveTo(x0 + r, y0 - r);
	context.lineTo(x0 - r, y0 + r);
	context.closePath();
	context.stroke();
}

function drawX(x, y, r) {
	restoreState();
	context.globalAlpha = 1;
	context.strokeStyle = colorX;
	context.lineWidth = strokeWidth;
	var x0 = posToCoord(x);
	var y0 = posToCoord(y);

	context.beginPath();
	context.moveTo(x0 - r, y0 - r);
	context.lineTo(x0 + r, y0 + r);
	context.moveTo(x0 + r, y0 - r);
	context.lineTo(x0 - r, y0 + r);
	context.closePath();
	context.stroke();
	saveState();
}

function drawWin(win, O, start, end) {
	restoreState();
	context.globalAlpha = 1;
	context.strokeStyle = 'black';
	context.lineWidth = strokeWidth;
	context.beginPath();
	context.moveTo(start[0], start[1]);
	context.lineTo(end[0], end[1]);
	context.closePath();
	context.stroke();
}

function drawEnd(win, O, txt) {
	context.lineWidth = strokeWidth;
	context.fillStyle = '#FFFFFF';
	context.globalAlpha = 0.75;
	context.fillRect(0, 0, W, H);
	context.globalAlpha = 1;

	context.fillStyle = !win ? 'black' : (O ? colorO : colorX);
	context.font = "100px Roboto";
	context.textAlign = 'center';
	context.textBaseline = 'middle';

	context.fillText(txt, W/2, H/2);
}

$( document ).ready(function() {
	doc = $("#canvas")[0];
	context = doc.getContext("2d");
});