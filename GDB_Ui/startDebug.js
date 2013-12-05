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
		data = data + '-------------\n';
	  	$('#paragraph')[0].value = $('#paragraph')[0].value.concat(data);
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

function insertBreakPoint(){
	var funcNm = $('#funcNm')[0].value;
	gdb.stdin.write('break ' + funcNm + '\n');
}

function run(){
	gdb.stdin.write('run' + '\n');
}

function performStep(){
	gdb.stdin.write('step' + '\n');
}

function next(){
	gdb.stdin.write('next' + '\n');
}