var moveO;
var board = [];
var resetTimer;

function initMatch() {
	clearBoard();
	moveO = true;
	winStart = [];
	winEnd = [];
	drawBoard(W, n);
	for (var i = 0; i < n; i++) {
		board[i] = new Array(n);
		board[i].fill(0);
	}

	$(doc).click(function(evt) {
		play(moveO, coordToPos(evt.offsetX), coordToPos(evt.offsetY));
	});
	$(doc).mousemove(function(evt) {
		highlightField(moveO, coordToPos(evt.offsetX), coordToPos(evt.offsetY));
	});
	$(doc).mouseout(function(evt) {
		removeHighlight();
	});
}

function changeLayout(val) {
	$(doc).unbind("click");
	$(doc).unbind("mousemove");
	$(doc).unbind("mouseout");
	clearTimeout(resetTimer);

	n = parseInt(val);
	toWin = val == 3 ? 3 : 5;
	W = val == 3 ? 500 : 750;
	H = W;
	strokeWidth = W/(val * 10)
	a = W/n;
	rO = a * 0.4 - strokeWidth;
	rX = a * 0.375 - strokeWidth;

	resizeBoard(W, H);
	initMatch();
}

function end(win, O) {
	$(doc).unbind("click");
	$(doc).unbind("mousemove");
	$(doc).unbind("mouseout");
	var endText = '';
	if (win) {
		var winner = O ? "O" : "X";
		var startCoord = [];
		var endCoord = [];
		var r = O ? rO : rX;
		r *= 1.25;
		startCoord[0] = posToCoord(winStart[0]);
		endCoord[0] = posToCoord(winEnd[0]);
		startCoord[1] = posToCoord(winStart[1]);
		endCoord[1] = posToCoord(winEnd[1]);
		endText = O ? "O WINS!" : "X WINS!";

		if (startCoord[0] > endCoord[0]) {
			startCoord[0] += r;
			endCoord[0] -= r;
		} else if (startCoord[0] < endCoord[0]) {
			startCoord[0] -= r;
			endCoord[0] += r;
		}

		if (startCoord[1] > endCoord[1]) {
			startCoord[1] += r;
			endCoord[1] -= r;
		} else if (startCoord[1] < endCoord[1]) {
			startCoord[1] -= r;
			endCoord[1] += r;
		}

		drawWin(win, O, startCoord, endCoord);
		drawEnd(win, O, endText);
	} else {
		endText = "IT'S A TIE!";
		drawEnd(win, O, endText);
	}
	resetTimer = window.setTimeout(initMatch, 5000);
}

function checkFull(f) {
	var full = true;
	for (var i = 0; i < n; i++) {
		if (board[i].indexOf(0) > -1) {
			full = false;
			break;
		}
	}
	return full;
}

function checkDir(O, x, y, dx, dy) {
	streak = 1;
	var streakStart = [x, y];
	var streakEnd = [x, y];
	for (i = 1; i < n; i++) {
		try {
			if (board[x+dx*i][y+dy*i] - 1 == O) {
				streak++;
				streakStart = [x+dx*i, y+dy*i];
			} else {
				break;
			}
		} catch(err) {
			break;
		}
	}
	for (i = 1; i < n; i++) {
		try {
			if (board[x-dx*i][y-dy*i] - 1 == O) {
				streak++;
				streakEnd = [x-dx*i, y-dy*i];
			} else {
				break;
			}
		} catch(err) {
			break;
		}
	}
	if (streak == toWin) {
		winStart = streakStart;
		winEnd = streakEnd;
	}
	return streak == toWin;
}

function checkWin(O, x, y) {
	var streak;
	if (checkDir(O, x, y, 1, 1) || checkDir(O, x, y, 1, -1) || checkDir(O, x, y, 0, 1) || checkDir(O, x, y, 1, 0)) {
		end(true, O);
	} else if (checkFull(board)) {
		end(false);
	}
}

function play(O, x, y) {
	if (!board[x][y]) {
		if (O) {
			board[x][y] = 2;
			drawO(x, y, rO);
		} else {
			board[x][y] = 1;
			drawX(x, y, rX);
		}
		moveO = !moveO;
		checkWin(O, x, y);
	} else {
		console.info("Cannot move there!");
	}
}

function highlightField(O, x, y) {
	if (!board[x][y]) {
		if (O) {
			highlightO(x, y, rO);
		} else {
			highlightX(x, y, rX);
		}
	}
}

$(document).ready(function() {
	var winStart = [];
	var winEnd = [];

	changeLayout($('option:selected', '#ver')[0].value);

	$('#ver').on('change', function(e) {
		var valueSelected = this.value;
		changeLayout(valueSelected);
	});
});
