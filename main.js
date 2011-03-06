var mainTerminal = null;

$(document).ready(function() {
	mainTerminal = new Terminal(new BashTerminal(), $("#lastline"), $("output"));
	mainTerminal.start();
});

function submit() {		
	$("#prefixin").text("user@jsbash:" + pwd() + "$");
	
	return false;
}

