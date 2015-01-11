var fs = require('fs');
var gui = require('nw.gui');

var collectCode = function(code, gdb) {
	return function(data) {
		code.content += data;
		if(gdb.stdin.destroyed) return;
		gdb.stdin.write('list\n');
	}

}

var onFullContent = function(code) {
	return function() {
		var codeLines = code.content.split('\n');
		var actualCodeLines = codeLines.slice(2); //remove unwanted lines as reading from .....
		var actualCode = actualCodeLines.join('\n');
		actualCode = actualCode.replace(/\(gdb\) /ig,'');
		interface.onFullCode(actualCode);
	}
}


var loadSymboles = function(fileName) {
	var code = {
		content: ''
	};
	spawn = require('child_process').spawn;
	var gdb = spawn('gdb', ['-q', fileName]);

	gdb.stdout.setEncoding('utf-8');
	gdb.stderr.setEncoding('utf-8');

	gdb.stdout.on('data', collectCode(code, gdb));

	gdb.stderr.on('data', function(errorMsg) {
		if(gdb.stdin.destroyed) return;
		gdb.stdin.write('quit\n');
		gdb.stdin.end();
	});

	gdb.stdout.on('end', onFullContent(code));
	gdb.on('exit', function(arg) {});
	gdb.stdin.write('list\n');
}

var openDebugWindow = function() {
	var fileName = jQuery('#exeFile')[0].value;
	fileName = fileName.replace(/\\/g, '/').replace(/ /g, '\\ ');
	console.log(fileName);
	var nextPageContent = fs.readFileSync('commands.html', 'utf-8');
	document.write(nextPageContent);
	loadFullFile(fileName);
}


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
// 	gdb.stdout.setEncoding('utf-8');												
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