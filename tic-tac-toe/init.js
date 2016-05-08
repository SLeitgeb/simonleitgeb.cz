var doc;
var W = 750;
var H = W;
var n = 10;
var toWin = 5;
var a = W/n;
var rO = a * 0.4 - strokeWidth;
var rX = a * 0.375 - strokeWidth;

var strokeWidth = 3;
var colorO = "#D33B25";
var colorX = "#4891D1";
var colorField = "#A6A6A6";

function posToCoord(pos) {
	return pos * a + a/2;
}

function coordToPos(coord) {
	return coord >= W ? parseInt((W-1)/a) : parseInt(coord/a);
}