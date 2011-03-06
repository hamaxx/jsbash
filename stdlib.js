var std = new Object();

std.help = function(par) {
	var out = "";
	for (var f in std) {
		out += "<div>" + f + "</div>"
	}
	std.echo(out);
	return true;
}

std.pwd = function(par) {
	std.echo(pwd());
	return true;
}

std.ls = function(par) {
	var out = "";
	for (var f in currentFolder.last().content) {
		out += "<div>" + currentFolder.last().content[f].fname + "</div>"
	}
	std.echo(out);
	return true;
}

std.mkdir = function(par) {
	if (par.length < 2) return false;
	
	currentFolder.last().content[par[1]] = new Folder(par[1]);
	
	return true;
}

std.cd = function(par) {
	if (par.length < 2) {
		return false;
	}
	
	if (par[1] == "..") {
		if (currentFolder.length > 1) {
			currentFolder.pop();
		}
		return false;
	} 
	
	if (par[1] == ".") {
		return false;
	} 
	
	if (par[1].charAt(0) == '/') {
		currentFolder = [topFolder];
		par[1] = par[1].substring(1);
	}
	
	if (par[1]) {
		var arr = par[1].split("/");
		for (var i = 0; i < arr.length; i++) {
			var c = currentFolder.last().content[arr[i]];
			if (c) {
				currentFolder.push(c);
			} else {
				return false;
			}
		}
	}
	
	return true;
}

std.touch = function(par) {	
	if (par.length < 2) return false;
	
	currentFolder.last().content[par[1]] = new File(par[1], "");
	
	return true;
}

std.echo = function(par) {
	if (par instanceof Array) {
		stdio += par[1];
	} else {
		stdio += par;
	}
	return true;
}

var stdio = "";
function parseInput() {
	var input = getCont();
	if (input) {
		callFunc(input.split(" "));
		print(stdio);
	}
	stdio = "";
}

function callFunc(input) {
	if (std[input[0]] !== undefined) {
		if (!std[input[0]](input)) std.echo("error");
		saveDrive();
	} else {
		stdio += "command not found";
	}
}

Array.prototype.last = function(t) {
	if (t !== undefined) {
		this[this.length - 1] = t;
	} else {
		return this[this.length - 1];
	}
}

Array.prototype.fromEnd = function(idx, t) {
	if (t !== undefined) {
		this[this.length - (idx + 1)] = t;
	} else {
		return this[this.length - (idx + 1)];
	}
}
