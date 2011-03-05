$(document).ready(function() {
	$("#inform").submit(function (e) {		
		appendLine();
		parseInput();
		
		$("#read").val("");
		$("terminal").attr({ scrollTop: $("terminal").attr("scrollHeight") });
		$("#prefixin").text("user@jsbash:" + std.pwd() + "$");
		
		return false;
	});
});

function parseInput() {
	var input = getCont();
	if (input) {
		print(std.callFunc(input.split(" ")));
	}
}

function getPrefix() {
	return $("#prefixin").text();
}

function getCont() {
	return $("#read").val();
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
