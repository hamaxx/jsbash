$(document).ready(function() {
	$("#read").text("");
	
	new Terminal(new BashTerminal(), $("#read")).start();
});

function submit() {		
	appendLine();
	parseInput();
		
	$("#read").text("");
	$("terminal").attr({ scrollTop: $("terminal").attr("scrollHeight") });
	$("#prefixin").text("user@jsbash:" + pwd() + "$");
	
	return false;
}

function getPrefix() {
	return $("#prefixin").text();
}

function getCont() {
	return $("#read").text();
}

function appendLine() {
	var prefix = $("<prefix>" + getPrefix() + "</prefix>");
	var cont = $("<inputholder>" + getCont() + "</inputholder>");

	var line = $("<inputfield></inputfield>");
	line.append(prefix);
	line.append(cont);
	
	$("output").append(line);
}

function print(str) {
	var line = $("<inputfield>" + str + "</inputfield>");	
	$("output").append(line);
}
