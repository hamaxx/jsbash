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
		
		if (isChrome() && (code in {37:"",38:"",39:"",40:"",46:"",8:""}) || ctrl) {
			if (code == 86) code = 118;
			
			var press = jQuery.Event("keypress");
			press.ctrlKey = ctrl;
			press.which = code;
			$(window).trigger(press);
		}
	});
	
	$(window).keypress(function(e) {
		if (!readOn) return true;
		stopBlink();
	
		var code = (e.keyCode ? e.keyCode : e.which);

		if (ctrl) {
			if (code == 118) {	//v
				var paste = prompt("Paste here","");
				if (paste) controller.charAdd(paste);
				code = -1;
				ctrl = false;
			} else {
				return true;
			}
		}

		if(code == 13) {							//return
			controller.returnPress();
		} else if (code == 37 && keydown != 53) {	//left
			controller.leftPress();
		} else if (code == 39 && keydown != 222) {	//right
			controller.rightPress();
		} else if (code == 38 && keydown != 55) {	//up
			controller.upPress();
		} else if (code == 40 && keydown != 58) {	//down
			controller.downPress();
		} else if (code == 46 && keydown == 46) {	//delete
			controller.deletePress();
		} else if (code == 8) {						//backspace
			controller.backspacePress();
		} else if (code > 31 && code < 127) {
			controller.charAdd(String.fromCharCode(code));
		}
		
		pos = 8 * controller.cursorPosition();
		input().css("background-position", pos + "px 0");
	
		return false;
	});
	
	var onFocus = function() {
		showCursor();
		if (!cursorInterval)
			cursorInterval = setInterval(showCursor, 500);
	}

	var onBlur = function() {	
		clearInterval(cursorInterval);
		cursorInterval = false;
		cursor = false;
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
		$(window).focus();
		//onFocus();
	}	

	this.changeText = function(text) {
		input().text(text);
	}
	
	this.write = function(str, prepend) {
		if (!prepend) {
			var l = $("<inputfield>" + str + "</inputfield>");	
			out.append(l);
		} else {
			line.prepend(str);
		}
		
		out.parent().attr({ scrollTop: out.parent().attr("scrollHeight") });
	}
	
	this.read = function() {
		return false;	//TODO
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

	$(window).focus();
	controller.init(this);	
}
