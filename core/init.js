var mainTerminal = null;

$(document).ready(function() {
	mainTerminal = new Terminal(new BashTerminal(), $("#lastline"), $("output"));
	mainTerminal.start();
});
