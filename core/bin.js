var functionFiles = ["core", "jsedit"];

var bin = new FF("d", "bin", new function() {});

if (!topFolder.content["bin"]) {
	topFolder.content["bin"] = bin;
}

$(document).ready(function() {
	for (var i = 0; i < functionFiles.length; i++) {
		$("head").append('<script src="core/bin/' + functionFiles[i] + '.js" type="text/javascript"></script>');
	}
	
	var thebin = topFolder.content["bin"];
	for (var f in bin.content) {
		thebin.content[f] = bin.content[f];
	}	
});

function addToBin(na, func) {
	bin.content[na] = new FF("-", na, func);
}
