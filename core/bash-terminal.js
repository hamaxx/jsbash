//cursorPosition, returnPress, upPress, downPress, leftPress, rightPress, deletePress, backspacePress, charAdd, init

var BashTerminal = function() {
	var position = 0;
	
	var historyArr = new Array();
	var historyPos = 0;
	
	var terminal = null;
	
	this.init = function(ter) {
		terminal = ter;
		historyArr.push("");
		
		terminal.write("<prefix>user@jsbash:/$</prefix>", true);
	}
	
	this.cursorPosition = function() {
		return position;
	}
	
	this.returnPress = function() {
			position = 0;
			if (historyArr.length < 2 || historyCurrent() != historyArr.last()) {
				var str =  historyCurrent();
				historyArr.last(str);
			} 
			
			terminal.submit();
			var line = historyCurrent();
			
			if (historyArr.fromEnd(1) != historyArr.last()) {
				historyArr.push("");
			}
	
			historyPos = 0;
			historyCurrent("");		
			
			parseInput(line, function() {
				terminal.write("<prefix>user@jsbash:" + pwd() + "$</prefix>", true);	
			});
	}

	this.deletePress = function() {
		if (position < historyCurrent().length) {
			del(false);
		}
	}
	
	this.backspacePress = function() {
		if (position > 0) {
			del(true);
			position--;
		}
	}
	
	this.upPress = function() {
		historyMove(true);
	}

	this.downPress = function() {
		historyMove(false);
	}
	
	this.leftPress = function() {
		if (position > 0)
			position--;
	}

	this.rightPress = function() {
		if (position < historyCurrent().length)
			position++;
	}
	
	this.charAdd = function(ch) {
		insert(ch);
		position += ch.length;
	}

	var historyCurrent = function(text, append) {
		if (text === undefined) {
			return historyArr.fromEnd(historyPos);
		} else {
			if (!append) {
				historyArr.fromEnd(historyPos, text);
			} else {
				historyArr.fromEnd(historyPos, historyArr.fromEnd(historyPos) + text);
			}
			terminal.changeText(historyArr.fromEnd(historyPos));
		}
	}

	var historyMove = function(up) {
		if (up) {
			historyPos++;
			historyPos = historyPos > historyArr.length - 1 ? historyArr.length - 1 : historyPos;
		} else {
			historyPos--;
			historyPos = historyPos < 0 ? 0 : historyPos;
		}
	
		terminal.changeText(historyCurrent());
		position = historyCurrent().length;
	}

	var del = function(back) {
		var text = historyCurrent();
		text = text.substring(0, position - (back ? 1 : 0)) + text.substring(position + (back ? 0 : 1));
		historyCurrent(text, false);
	}

	var insert = function(str) {
		var text = historyCurrent();
		text = text.substring(0, position) + str + text.substring(position);
		historyCurrent(text, false);
	}

}
