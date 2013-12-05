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
	gdb = spawn('gdb', [fileName]); // the second arg is the command 
	                                          // options
												// register one or more handlers
	gdb.stdout.setEncoding('utf-8');												
	gdb.stdout.on('data', function (data) {
	  	$('#paragraph')[0].textContent = $('#paragraph')[0].textContent.concat(data + '\n');
	});
	gdb.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});
	gdb.on('exit', function (code) {
	});
}

function showList(){
	gdb.stdin.write('list'+'\n');
};