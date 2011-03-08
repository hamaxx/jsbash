var Stream = function(instr, outstr, errstr) {
	this.inp = new function() {
		this.read = function(cb) {
			instr.read(cb);
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
	this.read = function(callback) {
		if (filePointer) {
			callback(filePointer.content);
		} else {
			callback(false);
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
		
		if (!quote) {
			if (ch == "|") {
				cmd.out = "pipe";
			} else if (ch == ">") {
				cmd.out = "file";
			} else if (ch == "&") {
		
			} else {
				end = false;
			}
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

var CallQueue = function() {
	var queue = new Array();
	var _this = this;
	
	this.add = function(func, stream) {
		queue.push({"func" : func, "stream" : stream});
	}
	
	this.next = function() {
		if (queue.length > 0) {
			var f = queue.shift();
			callFunc(f.func, f.stream, _this.next);
		} else {
			saveDrive();
		}
	}
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
		input = parseLine(input);
		
		var callQueue = new CallQueue();
		
		var pipe = new Pipe();
		for (var i = 0; i < input.length; i++) {
			if (input[i].inp == "file") break;

			var stream = new Stream(getStream(input[i].inp), getStream(input[i].out), mainTerminal);
			callQueue.add(input[i].par, stream);
		}
		callQueue.next();
	}
}

function callFunc(input, stream, next) {
	var f = openFile(input[0], true);
	if (f && $.isFunction(f.content)) {
		f.content(input, stream, next);
	} else {
		stream.err.write(input[0] + ": command not found");
	}
}
