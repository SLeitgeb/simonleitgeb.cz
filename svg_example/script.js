var populations = [];
var colorScheme = ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'];


document.getElementById("districts").addEventListener("load", function() {
	var d = document.getElementById("districts");
	// svgdocument = d.getSVGDocument();
	svgdocument = d.contentDocument;

	var linkElm = svgdocument.createElementNS("http://www.w3.org/1999/xhtml", "link");
	linkElm.setAttribute("href", "svg.css");
	linkElm.setAttribute("type", "text/css");
	linkElm.setAttribute("rel", "stylesheet");
	svgdocument.getElementsByTagName("svg")[0].appendChild(linkElm);

	paths = svgdocument.getElementsByTagName("path");

	for (i = 0; i < paths.length; i++) {
		populations.push(paths[i].getAttribute("data-ob11"));
		paths[i].addEventListener("touchend", parseClick, false);
		paths[i].addEventListener("click", parseClick, false);
	}
}, false);

function parseClick(event) {
	var srcPopulation = event.target.getAttribute("data-ob11");
	var maxDiff = Math.max(Math.max.apply(null, populations) - srcPopulation, srcPopulation - Math.min.apply(null, populations));
	var step = maxDiff/4;
	for (i = 0; i < paths.length; i++) {
		var curr = paths[i].getAttribute("data-ob11");
		var x = 3 - parseInt(Math.abs(curr - srcPopulation)/step - 0.01);
		paths[i].style.fill = colorScheme[x];
	};
	event.target.style.fill = colorScheme[4];
	document.getElementById("right").innerHTML = parseInt(srcPopulation);
}