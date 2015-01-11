var gdbDebugger = {};
var fs = require('fs');
var gui = require('nw.gui');
spawn = require('child_process').spawn;

var collectCode = function(code, gdbForList) {
	return function(data) {
		code.content += data;
		if (gdbForList.stdin.destroyed) return;
		gdbForList.stdin.write('list\n');
	}

}

var onFullContent = function(code) {
	return function() {
		var codeLines = code.content.split('\n');
		var actualCodeLines = codeLines.slice(2); //remove unwanted lines as reading from .....
		var actualCode = actualCodeLines.join('\n');
		actualCode = actualCode.replace(/\(gdb\) /ig, '');
		interface.onFullCode(actualCode);
	}
}

var spawnDebugTask = function(fileName){
	gdbDebugger.debugTask = spawn('gdb', ['-q', fileName]);
	
	gdbDebugger.debugTask.stdout.setEncoding('utf-8');
	gdbDebugger.debugTask.stderr.setEncoding('utf-8');

	gdbDebugger.debugTask.stdout.on('data', function(msg) {
		console.log(msg);
	});

	gdbDebugger.debugTask.stderr.on('data', function(errorMsg) {
		console.log(errorMsg);
	});
}


gdbDebugger.loadSymboles = function(fileName) {
	var code = {
		content: ''
	};
	spawnDebugTask(fileName);

	var gdbForList = spawn('gdb', ['-q', fileName]);

	gdbForList.stdout.setEncoding('utf-8');
	gdbForList.stderr.setEncoding('utf-8');

	gdbForList.stdout.on('data', collectCode(code, gdbForList));

	gdbForList.stderr.on('data', function(errorMsg) {
		if (gdbForList.stdin.destroyed) return;
		gdbForList.stdin.write('quit\n');
		gdbForList.stdin.end();
	});

	gdbForList.stdout.on('end', onFullContent(code));
	gdbForList.on('exit', function(arg) {});
	gdbForList.stdin.write('list\n');
}

var processCommand = function(command) {
	gdbDebugger.debugTask.stdin.write(command + '\n');
}

gdbDebugger.insertBreakPoint = function(lineNumber) {
	processCommand('break ' + lineNumber);
};

gdbDebugger.removeBreakPoint = function(lineNumber) {
	processCommand('clear ' + lineNumber);
};


// var showError = function(data){
// 	jQuery('#output_text')[0].style.height = "450";
//   	jQuery('#errorMsg')[0].style.height = "70";
// 	jQuery('#errorBtn')[0].style.height = "70";	
// 	jQuery('#ok')[0].style.height = "25";
// 	jQuery('#errorMsg')[0].textContent = data;
// }

// var showOutput = function(data){
// 	data += '\n----------------\n';
// 	jQuery('#output_text')[0].value = jQuery('#output_text')[0].value.concat(data);
// 	jQuery('#output_text')[0].value = jQuery('#output_text')[0].value.slice();
// 	jQuery('#output_text').scrollTop(jQuery('#output_text')[0].scrollHeight);
// }

// function startDebug (fileName) {
//     spawn = require('child_process').spawn;
// 	gdb = spawn('gdb', [fileName]); // the second arg is the command 
// 	                                          // options
// 												// register one or more handlers
// 	gdbForList.stdout.setEncoding('utf-8');												
// 	gdb.stdout.on('data', showOutput);
// 	gdb.stderr.on('data', showError);
// 	gdb.on('exit', function (code) {
// 	});
// }

// function performOperationWithValue(commandName,textBoxId){
// 	var textValue = jQuery(textBoxId)[0].value;
// 	gdb.stdin.write(commandName +' '+ textValue + '\n');
// 	jQuery(textBoxId)[0].value = '';
// }

// function performOperation(commandName){
// 	gdb.stdin.write(commandName + '\n');
// }

// function _quit(){
// 	gdb.stdin.write('quit' + '\n');
// 	gdb.stdin.end();
// 	var win = gui.Window.get();;
// 	win.on('close', function() {
//   		this.hide(); // Pretend to be closed already
// 		this.close(true);
// 	});

// 	win.close();
// 	gui.Window.get(
//   		window.open('index.html')
// 	);
// }

// function _reset(){
// 	jQuery('#output_text')[0].style.height = "525";
// 	jQuery('#errorMsg')[0].style.height = "0";
// 	jQuery('#ok')[0].style.height = "0";
// 	jQuery('#errorBtn')[0].style.height = "0";
// 	jQuery('#errorMsg')[0].textContent = "";
// }