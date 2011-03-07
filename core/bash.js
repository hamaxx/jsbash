var stdio = "";
function parseInput(input) {
	if (input.length) {
		input = input.replace(/ {2,}/g,' ');
	
		var out = false;
		input = input.split(">");
		if (input.length > 1) {
			out = input[1].match(/^\s?(.*)\s?$/)[1];
		}
		input = input[0].split(" ");
	
	
		callFunc(input);
		
		if (out) {
			bin.content.touch.content(["touch", out], stdio);
			stdio = "";
		}
		
		mainTerminal.echo(stdio);
	}
	stdio = "";
}

function gotoFile(path) {
	var f = new Array();
	for (var i = 0; i < currentFolder.length; i++)
		f[i] = currentFolder[i];
		
	f = gotoFolder(path, f, true);
	if (!f) return false;
	
	f = f.last().content[path.split("/").last()];

	return f;
}

function callFunc(input) {
	var f = gotoFile(input[0]);
	if (f && $.isFunction(f.content)) {
		if (!f.content(input)) bin.content.echo.content("error");
		saveDrive();
	} else {
		stdio += "command not found";
	}
}
