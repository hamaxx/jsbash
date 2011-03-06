function Folder(fname) {
	this.fname = fname;
	this.content = new Object();
	this.mod = 777;
	this.type = "d";
}

function File(fname, content) {
	this.fname = fname;
	this.content = content;
	this.mod = 777;
	this.type = "-";
}

var currentFolder = new Array();
var topFolder = null;

$(document).ready(function() {
	//alert($.jStorage.get("drive"));
	
	try {
		var t = JSON.parse(sessionStorage.getItem("drive"));
		if (!t) throw "err"; 
		topFolder = t;
	} catch(e) {
		//alert();
		topFolder = new Folder("");
	}
	
	currentFolder.push(topFolder);
});

function pwd() {
	var out = currentFolder.length == 1 ? "/" : "";
	
	for (var i = 1; i < currentFolder.length; i++) {
		out += "/" + currentFolder[i].fname;
	}
	return out;
}

function saveDrive() {
	if (topFolder) {
		sessionStorage.setItem("drive", JSON.stringify(topFolder));
	}
}
