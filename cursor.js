var cursor = true;
var cursorInterval = false;
var ctrl = false;
var keydown = 0;

var position = 0;

var history = new Array();

$(document).ready(function() {
	cursorInterval = setInterval(showCursor, 500);
	history.push("");
	
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
			submit();
			position = 0;
		} else if (code == 37) {	//left
			if (position > 0)
				position--;
		} else if (code == 39) {	//right
			if (position < historyCurrent().length)
				position++;
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
			historyCurrent(String.fromCharCode(code), true);
			position++;
		}

		pos = 8 * position;
		$("#read").css("background-position", pos + "px 0");
		
		return false;
	});
});

function historyCurrent(text, append) {
	if (text === undefined && append === undefined) {
		return history.last();
	} else {
		if (!append) {
			history.last(text);
		} else {
			history.last(history.last() + text);
		}
		$("#read").text(history.last());
	}
}

function del(back) {
	var text = historyCurrent();
	text = text.substring(0, position - (back ? 1 : 0)) + text.substring(position + (back ? 0 : 1));
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
