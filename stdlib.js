var std = new Object();

std.help = function(par) {
	var out = "";
	for (var f in std) {
		out += "<div>" + f + "</div>"
	}
	return out;
}

std.pwd = function(par) {
	var c = currentFolder;
	var out = "/" + c.name;
	while (c.parent != null && c.parent.parent != null) {
		c = c.parent;
		out = "/" + c.name + out;
	}
	return out;
}

std.ls = function(par) {
	var out = "";
	for (var f in currentFolder.content) {
		out += "<div>" + currentFolder.content[f].name + "</div>"
	}
	return out;
}

std.mkdir = function(par) {
	if (par.length < 2) return "error";
	
	currentFolder.content[par[1]] = new Folder(par[1], currentFolder);
	
	return "";
}

std.cd = function(par) {
	if (par.length < 2) {
		return "error";
	}
	
	if (par[1] == "..") {
		if (currentFolder.parent) {
			currentFolder = currentFolder.parent;
		}
	} else if (par[1] == ".") {
		
	} else if (currentFolder.content[par[1]] !== undefined && currentFolder.content[par[1]].type == "d") {
		currentFolder = currentFolder.content[par[1]];
	}
	
	return "";
}

std.touch = function(par) {	
	if (par.length < 2) return "error";
	
	currentFolder.content[par[1]] = new File(par[1], "");
	
	return "";
}

callFunc = function(input) {
	if (std[input[0]] !== undefined) {
		return std[input[0]](input);
	} else {
		return "command not found";
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
