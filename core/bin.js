var bin = new FF("d", "bin", new function() {
	this.help = new FF("-", "help", function(par, stream) {
		var out = "";
		for (var f in bin.content) {
			out += "<div>" + f + "</div>"
		}
		stream.out.write(out);
		return true;
	});

	this.pwd = new FF("-", "pwd", function(par, stream) {
		stream.out.write(pwd());
		return true;
	});

	this.ls = new FF("-", "ls", function(par, stream) {
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
		stream.out.write(out);
		return true;
	});

	this.mkdir = new FF("-", "mkdir", function(par, stream) {
		if (par.length < 2) return false;

		currentFolder.last().content[par[1]] = new FF("d", par[1]);

		return true;
	});

	this.cd = new FF("-", "cd", function(par, stream) {
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

	this.touch = new FF("-", "touch", function(par, stream) {
		if (par.length < 2) return false;

		currentFolder.last().content[par[1]] = new FF("-", par[1], "");

		return true;
	});
/*
	this.echo = new FF("-", "echo", function(par) {
		if (par.length < 2) return false;
		
		if (par instanceof Array) {
			stdio += par[1];
		} else {
			stdio += par;
		}
		return true;
	});
*/	
	this.cat = new FF("-", "cat", function(par, stream) {
		if (par.length < 2) return false;

		if(par[1].match(/^[a-zA-Z]/)) {
			par[1] = "./" + par[1];
		}
		
		var f = gotoFile(par[1]);
		if (f && f.type == "-") {
			stream.out.write(f.content);
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
