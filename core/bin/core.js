bin.content.help = new FF("-", "help", function(par, stream, next) {
	var out = "";
	for (var f in bin.content) {
		out += "<div>" + f + "</div>"
	}
	stream.out.write(out);
	next();
});

bin.content.pwd = new FF("-", "pwd", function(par, stream, next) {
	stream.out.write(pwd());
	next();
});

bin.content.ls = new FF("-", "ls", function(par, stream, next) {
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

bin.content.mkdir = new FF("-", "mkdir", function(par, stream, next) {
	if (par.length < 2) return next();

	currentFolder.last().content[par[1]] = new FF("d", par[1]);

	next();
});

bin.content.cd = new FF("-", "cd", function(par, stream, next) {
	if (par.length < 2) return next();
	
	var tmp = openFolder(par[1], currentFolder);
	if (tmp)
		currentFolder = tmp;

	next();
});

bin.content.touch = new FF("-", "touch", function(par, stream, next) {	//TODO rewrite
	if (par.length < 2) return next();

	currentFolder.last().content[par[1]] = new FF("-", par[1], "");

	next();
});

bin.content.echo = new FF("-", "echo", function(par, stream, next) {
	if (par.length < 2) return next();
	
	stream.out.write(par[1]);
	
	next();
});

bin.content.cat = new FF("-", "cat", function(par, stream, next) {
	if (par.length < 2) return next();

	new FileStream(openFile(par[1])).read(function(fs) {
		if (fs !== undefined) {
			stream.out.write(fs);
		}
		next();		
	});
});
