var Stream = function(instr, outstr, errstr) {
	this.inp = new function() {
		this.read = function() {
			return instr.read();
		}
	}

	this.out = new function() {
		this.write = function(s) {
			outstr.write(s);
		}
	}
	
	this.err = new function() {
		this.write = function(s) {
			errstr.write(s);
		}
	}
}

var Pipe = function() {
	var queue = new Array();
	this.read = new function() {
		if (queue.length > 0) {
			return queue.shift();
		} else {
			return false;
		}
	}
	
	this.write = new function(s) {
		queue.push(s);
	}
}

var FileStream = function(filePointer) {
	this.read = function() {
		if (filePointer) {
			return filePointer.content;
		} else {
			return false
		}
	}
	
	this.write = function(s) {
		if (filePointer) {
			filePointer.content += s;
		} else {
			return false;
		}
	}
}

function parseInput(input) {
	if (input.length) {
		input = input.split(" ");
		
		var stream = new Stream(mainTerminal, mainTerminal, mainTerminal);
		
		callFunc(input, stream);
	}
}

function gotoFile(path, fromBin) {
	folder = path.substring(0, path.lastIndexOf("/") + 1);

	var f = new Array();
	for (var i = 0; i < currentFolder.length; i++)
		f[i] = currentFolder[i];
		
	f = gotoFolder(folder, f, fromBin);
	if (!f) return false;
	
	f = f.last().content[path.split("/").last()];

	return f;
}

function callFunc(input, stream) {
	var f = gotoFile(input[0], true);
	if (f && $.isFunction(f.content)) {
		if (!f.content(input, stream)) stream.err.write("error");
		saveDrive();
	} else {
		stream.err.write("command not found");
	}
}
