//stop, start, changeText, echo, submit

var Terminal = function(controller, line, out) {

	var cursor = true;
	var cursorInterval = false;
	var ctrl = false;
	var keydown = 0;
	var readOn = false;
	var dontHide = false;
		
	$(window).focus(function() {
		onFocus();
	});

	$(window).blur(function(){
		onBlur();
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
		if (!readOn) return true;
		if (ctrl) return true;
		stopBlink();
	
		var code = (e.keyCode ? e.keyCode : e.which);

		if(code == 13) {	//return
			controller.returnPress();
		} else if (code == 37) {	//left
			controller.leftPress();
		} else if (code == 39) {	//right
			controller.rightPress();
		} else if (code == 38) {	//up
			controller.upPress();
		} else if (code == 40) {	//down
			controller.downPress();
		} else if (code == 46 && keydown == 46) {	//delete
			controller.deletePress();
		} else if (code == 8) {	//backspace
			controller.backspacePress();
		} else if (code > 31 && code < 127){
			controller.charAdd(code);
		}
	
		pos = 8 * controller.cursorPosition();
		input().css("background-position", pos + "px 0");
	
		return false;
	});
	
	var onFocus = function() {
		if (!cursorInterval)
			cursorInterval = setInterval(showCursor, 500);
	}

	var onBlur = function() {	
		clearInterval(cursorInterval);
		cursorInterval = false;
		input().css("background-image", "url('img/cursor-blur.png')");
	}
	
	var stopBlink = function() {
		showCursor();
		clearTimeout(dontHide);
		dontHide = setTimeout(function() {
			dontHide = false;
		}, 500);
	};

	var input = function() {
		return line.find("inputholder");
	}
	
	this.stop = function() {
		readOn = false;
		onBlur();
	}
	
	this.start = function() {
		readOn = true;
		//onFocus();
	}	

	this.changeText = function(text) {
		input().text(text);
	}
	
	this.echo = function(str, prepend) {
		if (!prepend) {
			var l = $("<inputfield>" + str + "</inputfield>");	
			out.append(l);
		} else {
			line.prepend(str);
		}
		
		out.parent().attr({ scrollTop: out.parent().attr("scrollHeight") });
	}
	
	this.submit = function() {
		input().css("background-image", "none");
		out.append("<inputfield>" + line.html() + "</inputfield>");
		line.html("<inputholder />");

		out.parent().attr({ scrollTop: out.parent().attr("scrollHeight") });
	}

	var showCursor = function() {
		if (cursor) {
			if (dontHide === false) {
				cursor = false;
				input().css("background-image", "none");
			}
		} else {
			cursor = true;
			input().css("background-image", "url('img/cursor-focus.png')");
		}
	}
	
	//cursorInterval = setInterval(showCursor, 500);
	$(window).focus();
	controller.init(this);
	
}
