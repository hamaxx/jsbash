var bin = new FF("d", "bin", new function() {
	this.help = new FF("-", "help", function(par) {
		var out = "";
		for (var f in bin.content) {
			out += "<div>" + f + "</div>"
		}
		bin.content.echo.content(out);
		return true;
	});

	this.pwd = new FF("-", "pwd", function(par) {
		bin.content.echo.content(pwd());
		return true;
	});

	this.ls = new FF("-", "ls", function(par) {
		var out = "";
		
		if (par.length > 1 && par[1] == "-l") {
			for (var f in currentFolder.last().content) {
				var ff = currentFolder.last().content[f];
				out += "<div>" + FF.ffMod(ff) + " user jsbash " + FF.ffSize(ff) + " " + FF.ffDate(ff) + " " + ff.fname + "</div>";
			}
		} else {
			for (var f in currentFolder.last().content) {
				var ff = currentFolder.last().content[f];
				out += "<span " + (ff.type == "d" ? 'class=\'folder\'' : '') + " >" + ff.fname + "</span>"
			}
		}
		bin.content.echo.content(out);
		return true;
	});

	this.mkdir = new FF("-", "mkdir", function(par) {
		if (par.length < 2) return false;

		currentFolder.last().content[par[1]] = new FF("d", par[1]);

		return true;
	});

	this.cd = new FF("-", "cd", function(par) {
		if (par.length < 2) {
			return false;
		}
		
		if(par[1].match(/^[a-zA-Z]/)) {
			par[1] = "./" + par[1];
		}

		var tmp = gotoFolder(par[1], currentFolder);
		if (tmp)
			currentFolder = tmp;
		else
			return false;
			
		return true;
	});

	this.touch = new FF("-", "touch", function(par, cont) {
		if (par.length < 2) return false;
		
		cont = cont ? cont : "";

		currentFolder.last().content[par[1]] = new FF("-", par[1], cont);

		return true;
	});

	this.echo = new FF("-", "echo", function(par) {
		if (par.length < 2) return false;
		
		if (par instanceof Array) {
			stdio += par[1];
		} else {
			stdio += par;
		}
		return true;
	});
	
	this.cat = new FF("-", "cat", function(par) {
		if (par.length < 2) return false;

		if(par[1].match(/^[a-zA-Z]/)) {
			par[1] = "./" + par[1];
		}
		
		var f = gotoFile(par[1]);
		if (f && f.type == "-") {
			bin.content.echo.content(f.content);
			return true;
		}
		return false;
	});
	
});

$(document).ready(function() {
	if (!topFolder.content["bin"]) {
		topFolder.content["bin"] = bin;
	} else {
		var thebin = topFolder.content["bin"];
		for (var f in bin.content) {
			thebin.content[f] = bin.content[f];
		}
	}
});

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
