function openDebugWindow(){
    var fileName = $('#exeFile')[0].value;
    fileName = fileName.replace(/\\/g,'/');
    console.log(fileName);
	var nextPageContent = require('fs').readFileSync('commands.html','utf-8');
	document.write(nextPageContent);
	startDebug(fileName);
}

function startDebug (fileName) {
    spawn = require('child_process').spawn;
	var gdb = spawn('gdb', [fileName]); // the second arg is the command 
	                                          // options
	gdb.stdout.on('data', function (data) {    // register one or more handlers
	  	$('#output')[0].textContent = $('#output')[0].textContent.concat(data);
	});

	gdb.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	gdb.on('exit', function (code) {
	});
}