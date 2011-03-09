addToBin("jsedit", function(par, stream, next) {
	mainTerminal.stop();
	
	if (par.length < 2) return next();

	var file = openFile(par[1]);
	var content = "";
	if (!file) {
		if (!touch(par[1])) {
			stream.out.write("error while opening file");
			return next();
		} else {
			file = openFile(par[1]);
		}
	} else {
		content = file.content;
	}

	var back = $("<div id='floatBackground'></div>");
	var text = $("<textarea id='floatText'>" + content + "</textarea>");
	
	var menu = $('<div class="appMenu"></div>');
	var save = $('<input type="button" id="jseditSave" value="Save" />');
	var cancle = $('<input type="button" id="jseditCancle"value="Cancle" />');
	menu.append(save).append(cancle);
	
	back.append(text).append(menu);
	
	$("body").append(back);
	
	$("#floatText").click(function(event) {
		event.stopPropagation();
	}).focus();
	
	$("#jseditSave").click(function(event) {
		file.content = $("#floatText").val();
		back.remove();
		next();
	});
	
	$("#jseditCancle, #floatBackground").click(function(event) {
		back.remove();
		next();
	});	
});
