var std = new Object();

std.help = function(par) {
	var out = "";
	for (var f in std) {
		out += "<div>" + f + "</div>"
	}
	return out;
}

std.pwd = function(par) {
	var out = currentFolder.length == 1 ? "/" : "";
	
	for (var i = 1; i < currentFolder.length; i++) {
		out += "/" + currentFolder[i].fname;
	}
	return out;
}

std.ls = function(par) {
	var out = "";
	for (var f in currentFolder.last().content) {
		out += "<div>" + currentFolder.last().content[f].fname + "</div>"
	}
	return out;
}

std.mkdir = function(par) {
	if (par.length < 2) return "error";
	
	currentFolder.last().content[par[1]] = new Folder(par[1]);
	
	return "";
}

std.cd = function(par) {
	if (par.length < 2) {
		return "error";
	}
	
	if (par[1] == "..") {
		if (currentFolder.length > 1) {
			currentFolder.pop();
		}
		return "";
	} 
	
	if (par[1] == ".") {
		return "";
	} 
	
	if (par[1].charAt(0) == '/') {
		currentFolder = new Array();
	}
	
	currentFolder.push(currentFolder.last().content[par[1]]);
	
	//alert(JSON.stringify(currentFolder));
	
	return "";
}

std.touch = function(par) {	
	if (par.length < 2) return "error";
	
	currentFolder.last().content[par[1]] = new File(par[1], "");
	
	return "";
}

callFunc = function(input) {
	if (std[input[0]] !== undefined) {
		var out = std[input[0]](input);
		saveDrive();
		return out;
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
