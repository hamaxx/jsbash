var cursor = true;
var cursorInterval = false;
var ctrl = false;
var keydown = 0;

var position = 0;

var historyArr = new Array();
var historyPos = 0;

$(document).ready(function() {
	cursorInterval = setInterval(showCursor, 500);
	historyArr.push("");
	
	$(window).focus(function() {
		if (!cursorInterval)
			cursorInterval = setInterval(showCursor, 500);
	});
	
	$(window).blur(function(){
		clearInterval(cursorInterval);
		cursorInterval = false
		$("#read").css("background-image", "url('img/cursor-blur.png')");
	});
	
	$(window).keyup(function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 17) {
			ctrl = false;
		}
	});
	
	$(window).keydown(function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		keydown = code;
		if(code == 17) {
			ctrl = true;
		}
	});
	
	$(window).keypress(function(e) {
		if (ctrl) return true;
		
		var code = (e.keyCode ? e.keyCode : e.which);

		if(code == 13) {	//return
			returnPress();
		} else if (code == 37) {	//left
			if (position > 0)
				position--;
		} else if (code == 39) {	//right
			if (position < historyCurrent().length)
				position++;
		} else if (code == 38) {	//up
			historyMove(true);
		} else if (code == 40) {	//down
			historyMove(false);
		} else if (code == 46 && keydown == 46) {	//delete
			if (position < historyCurrent().length) {
				del(false);
			}
		} else if (code == 8) {	//backspace
			if (position > 0) {
				del(true);
				position--;
			}
		} else if (code > 31 && code < 127){
			//historyCurrent(String.fromCharCode(code), true);
			insert(String.fromCharCode(code));
			position++;
		}

		pos = 8 * position;
		$("#read").css("background-position", pos + "px 0");
		
		return false;
	});
});

function returnPress() {
		position = 0;
		if (historyArr.length < 2 || historyCurrent() != historyArr.last()) {
			var str =  historyCurrent();
			//alert(str);
			historyArr.last(str);
		} 

		submit();
		
		if (historyArr.fromEnd(1) != historyArr.last()) {
			historyArr.push("");
		}
		
		historyPos = 0;
		historyCurrent("");
}

function historyCurrent(text, append) {
	if (text === undefined) {
		return historyArr.fromEnd(historyPos);
	} else {
		if (!append) {
			historyArr.fromEnd(historyPos, text);
		} else {
			historyArr.fromEnd(historyPos, historyArr.fromEnd(historyPos) + text);
		}
		$("#read").text(historyArr.fromEnd(historyPos));
	}
}

function historyMove(up) {
	if (up) {
		historyPos++;
		historyPos = historyPos > historyArr.length - 1 ? historyArr.length - 1 : historyPos;
	} else {
		historyPos--;
		historyPos = historyPos < 0 ? 0 : historyPos;
	}
	
	$("#read").text(historyCurrent());
}

function del(back) {
	var text = historyCurrent();
	text = text.substring(0, position - (back ? 1 : 0)) + text.substring(position + (back ? 0 : 1));
	historyCurrent(text, false);
}

function insert(str) {
	var text = historyCurrent();
	text = text.substring(0, position) + str + text.substring(position);
	historyCurrent(text, false);
}

function showCursor() {
	if (cursor) {
		cursor = false;
		$("#read").css("background-image", "none");
	} else {
		cursor = true;
		$("#read").css("background-image", "url('img/cursor-focus.png')");
	}
}
