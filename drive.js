function Drive(type) {
	this.type = type; //folder(d), file(-)
	this.name = null;
	this.content = null; //string, array
	this.parent = null;
	this.mod = 777;
}

Folder.prototype = new Drive("d");
Folder.prototype.constructor=Folder;
function Folder(name, parent) {
	this.name = name;
	this.parent = parent;
	this.content = new Object();
}

File.prototype = new Drive("-");
File.prototype.constructor=File;
function File(name, content) {
	this.name = name;
	this.content = content;
}

var topFolder = new Folder("", null);
var currentFolder = topFolder;
