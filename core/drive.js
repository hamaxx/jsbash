var currentFolder = new Array();
var topFolder = null;

function FF(type, fname, content) {
	this.fname = fname;
	this.content = content !== undefined ? content : new Object();
	this.mod = 777;
	this.type = type;
	this.date = new Date();
}

FF.ffDate = function(ff) {
	date = new Date(ff.date);
	return date.getFullYear() + "-" + 
		(date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) + "-" + 
		(date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + 
		date.getHours() + ":" + 
		date.getMinutes();
}

FF.ffSize = function (ff) {
	return JSON.stringify(ff).length;
}

FF.ffMod = function (ff) {
	return ff.type + "rwxrwxrwx";
}


try {
	var t = false;
	if (html5_storage())
		t = JSON.parse(localStorage.getItem("drive"));
	if (!t) throw "err"; 
	topFolder = t;
} catch(e) {
	topFolder = new FF("d", "");
}

currentFolder.push(topFolder);


function openFolder(path, folders, fromBin) {
	if (path.length > 0 && path.charAt(0) == '/') {
		folders = [topFolder];
		path = path.substring(1);
	} else if(fromBin) {
		folders = new Array(topFolder, topFolder.content["bin"]);
	}

	if (path) {
		var arr = path.split("/");
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == "..") {
				if (folders.length > 1) {
					folders.pop();
				}	
			} else if (arr[i] == ".") {
		
			} else if (c = folders.last().content[arr[i]]) {
				if (c.type == "d") {
					folders.push(c);
				} else {
					return false;
				}
			} else {
				return false;
			} 
		}
	}
	return folders;
}

function openFilesFolder(path, fromBin) {
	folder = path.substring(0, path.lastIndexOf("/") + 1);
	
	var f = new Array();
	for (var i = 0; i < currentFolder.length; i++)
		f[i] = currentFolder[i];
		
	f = openFolder(folder, f, fromBin);
	if (!f) return false;
	return f;
}

function openFile(path, fromBin) {
	var f = openFilesFolder(path, fromBin);
	
	if (!f) return false;
	f = f.last().content[path.split("/").last()];

	return f;
}

function touch(path) {
	var folder = openFilesFolder(path);
	if (!folder) return false;

	var fn = path.substring(path.lastIndexOf("/") + 1);
	if (!fn) return false;
	
	var file = new FF("-", fn, "");
	folder.last().content[fn] = file;
	
	return file;
}

function pwd() {
	var out = currentFolder.length == 1 ? "/" : "";
	
	for (var i = 1; i < currentFolder.length; i++) {
		out += "/" + currentFolder[i].fname;
	}
	return out;
}

function saveDrive() {
	if (topFolder && html5_storage()) {
		localStorage.setItem("drive", JSON.stringify(topFolder));
	}
}
