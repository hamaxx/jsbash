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

var pipe = new function() {
	var queue = new Array();
	this.read = function() {
		if (queue.length > 0) {
			return queue.shift();
		} else {
			return false;
		}
	}
	
	this.write = function(s) {
		queue.push(s);
	}
}

function parseInput(input) {
	if (input.length) {
		input = input.split(" ");
		
		var stream = new Stream(mainTerminal, mainTerminal, mainTerminal);
		
		callFunc(input, stream);
	}
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

function callFunc(input, stream) {
	var f = gotoFile(input[0]);
	if (f && $.isFunction(f.content)) {
		if (!f.content(input, stream)) stream.err.write("error");
		saveDrive();
	} else {
		stream.err.write("command not found");
	}
}
