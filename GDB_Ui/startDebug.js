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
		// data = data + '--\n';
	  	$('#paragraph')[0].value = $('#paragraph')[0].value.concat(data);
	  	$('#paragraph')[0].value = $('#paragraph')[0].value.slice();
	  	$('#paragraph').scrollTop($('#paragraph')[0].scrollHeight);
	});
	gdb.stderr.on('data', function (data) {
	  $('#paragraph')[0].style.height = "450";
	  $('#errorMsg')[0].style.height = "70";
	  $('#errorBtn')[0].style.height = "70";
	  $('#errorMsg')[0].textContent = data;
	});
	gdb.on('exit', function (code) {
	});
}

function _list(){
	gdb.stdin.write('list'+'\n');
};

function _break(){
	var funcNm = $('#funcNm')[0].value;
	gdb.stdin.write('break ' + funcNm + '\n');
	$('#funcNm')[0].value = '';
}

function _run(){
	gdb.stdin.write('run' + '\n');
}

function _step(){
	gdb.stdin.write('step' + '\n');
}

function _next(){
	gdb.stdin.write('next' + '\n');
}

function _continue(){
	gdb.stdin.write('continue' + '\n');
}

function _finish(){
	gdb.stdin.write('finish' + '\n');
}

function _up(){
	gdb.stdin.write('up' + '\n');
}

function _down(){
	gdb.stdin.write('down' + '\n');
}

function _reset(){
	$('#paragraph')[0].style.height = "525";
	$('#errorMsg')[0].style.height = "0";
	$('#errorBtn')[0].style.height = "0";
	$('#errorMsg')[0].textContent = "";
}