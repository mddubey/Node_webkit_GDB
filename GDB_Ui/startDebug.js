var fs = require('fs');
var gui = require('nw.gui');

function openDebugWindow(){
    var fileName = jQuery('#exeFile')[0].value;
    fileName = fileName.replace(/\\/g,'/').replace(/ /g,'\\ ');
    console.log(fileName);
	var nextPageContent = fs.readFileSync('commands.html','utf-8');
	document.write(nextPageContent);
	// startDebug(fileName);
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