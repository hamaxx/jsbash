$(document).ready(function() {
	$("#resetAll").click(function() {
		if (confirm("Are you sure you want to delete everything?")) {
			localStorage.setItem("drive", "");
			window.location.reload();
		}
	});
	
	$("#saveDrive").click(function() {
		var store = localStorage.getItem("drive");
		store = store ? store : "No modifications."
		
		var text = $("<textarea id='floatText'>" + store + "</textarea>");
		var back = $("<div id='floatBackground'></div>");
		
		back.append(text);
		
		$("body").append(back);
		
		$("#floatText").click(function(event) {
			event.stopPropagation();
		}).focus();
		
		$("#floatBackground").click(function() {
			$(this).remove();
		});
	});
	
	$("#loadDrive").click(function() {
		var text = $("<textarea id='floatText'></textarea>");
		var back = $("<div id='floatBackground'></div>");
		var load = $('<input type="button" id="loadDriveString" value="Load file system" />');
		
		back.append(text).append(load);
		
		$("body").append(back);
		
		$("#floatText").click(function(event) {
			event.stopPropagation();
		}).focus();
		
		$("#loadDriveString").click(function(event) {
			try {
				var test = JSON.parse($("#floatText").val());
				if (!test) throw "error";
				localStorage.setItem("drive", $("#floatText").val());
				window.location.reload();
			} catch(e) {
				alert("ERROR");
			}
		});
		
		$("#floatBackground").click(function() {
			$(this).remove();
		});
	});
	
});

