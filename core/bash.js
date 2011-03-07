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

function parseLine(input) {
	var skipws = function(i) {
		for (++i; i < input.length && input.charAt(i) == ' '; i++);
		return --i;
	}
	
	var cmdinit = function(inp) {
		var c = new Object();
		c["out"] = "ter";
		c["inp"] = inp;
		c["par"] = new Array();
		return c;
	}
	
	input += "&";
	
	var cmds = new Array();
	var buff = "";
	var quote = false;
		
	var cmd = cmdinit("ter");
	for (var i = 0; i < input.length; i++) {
		ch = input.charAt(i);
		var end = true;
		
		if (ch == "|") {
			cmd.out = "pipe";
		} else if (ch == ">") {
			cmd.out = "file";
		} else if (ch == "&") {
		
		} else {
			end = false;
		}
		
		if (end) {
			if (buff) {
				cmd.par.push(buff);
				buff = "";
			}
			cmds.push(cmd);
			cmd = cmdinit(cmd.out);
		} else {
			if (ch == " " && !quote) {
				if (buff) {
					cmd.par.push(buff);
					buff = "";
				}
				i = skipws(i);
			} else if (ch == "\"") {
				quote ^= true;
			} else {
				buff += ch;
			}
		}
	}
	
	return cmds;
}

function parseInput(input) {
	
	var getStream = function(str) {
		if (str == "ter") {
			return mainTerminal;
		} else if (str == "pipe") {
			return pipe;
		} else if (str == "file") {
			if (i < input.length - 1) {
				var path = input[i + 1].par[0];
				if (!path) return null;
				
				var file = touch(path);
				if (!file) return null;

				return new FileStream(file);
			}
		}
		return null;
	}

	if (input.length) {
		//alert(JSON.stringify(parseLine(input)));
	
		input = parseLine(input);
		
		var pipe = new Pipe();
		for (var i = 0; i < input.length; i++) {
			if (input[i].inp == "file") break;
			
			//alert(input[i].out);
			
			var stream = new Stream(getStream(input[i].inp), getStream(input[i].out), mainTerminal);
			callFunc(input[i].par, stream);
		}
				
		
	//	var stream = new Stream(mainTerminal, mainTerminal, mainTerminal);
		
	//	callFunc(input, stream);
	}
}

function callFunc(input, stream) {
	var f = openFile(input[0], true);
	if (f && $.isFunction(f.content)) {
		if (!f.content(input, stream)) stream.err.write("error");
		saveDrive();
	} else {
		stream.err.write(input[0] + ": command not found");
	}
}
