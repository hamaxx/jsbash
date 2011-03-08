addToBin("help", function(par, stream, next) {
	var out = "";
	for (var f in bin.content) {
		out += "<div>" + f + "</div>"
	}
	stream.out.write(out);
	next();
});

addToBin("pwd", function(par, stream, next) {
	stream.out.write(pwd());
	next();
});

addToBin("ls", function(par, stream, next) {
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
	next();
});

addToBin("mkdir", function(par, stream, next) {
	if (par.length < 2) return next();

	currentFolder.last().content[par[1]] = new FF("d", par[1]);

	next();
});

addToBin("cd", function(par, stream, next) {
	if (par.length < 2) return next();
	
	var tmp = openFolder(par[1], currentFolder);
	if (tmp)
		currentFolder = tmp;

	next();
});

addToBin("touch", function(par, stream, next) {	//TODO rewrite
	if (par.length < 2) return next();

	currentFolder.last().content[par[1]] = new FF("-", par[1], "");

	next();
});

addToBin("echo", function(par, stream, next) {
	if (par.length < 2) return next();
	
	stream.out.write(par[1]);
	
	next();
});

addToBin("cat", function(par, stream, next) {
	if (par.length < 2) return next();

	new FileStream(openFile(par[1])).read(function(fs) {
		if (fs !== undefined) {
			stream.out.write(fs);
		}
		next();		
	});
});
