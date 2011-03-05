var cursor = true;
var cursorInterval = false;
var ctrl = false;

$(document).ready(function() {
	cursorInterval = setInterval(showCursor, 500);
	
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
		if(code == 17) {
			ctrl = true;
		}
	});
	
	$(window).keypress(function(e) {
		if (ctrl) return true;
		
		var code = (e.keyCode ? e.keyCode : e.which);
		
		if(code == 13) {
			submit();
		} else {
			$("#read").append(String.fromCharCode(code));
		}
		
		var pos = $("#read").text().length;
		//alert(pos);
		pos = 8 * (pos);
		$("#read").css("background-position", pos + "px 0");
		
		return false;
	});
});

function showCursor() {
	if (cursor) {
		cursor = false;
		$("#read").css("background-image", "none");
	} else {
		cursor = true;
		$("#read").css("background-image", "url('img/cursor-focus.png')");
	}
}
