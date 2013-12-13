var fs = require('fs');
var gui = require('nw.gui');
function openDebugWindow(){
    var fileName = $('#exeFile')[0].value;
    fileName = fileName.replace(/\\/g,'/').replace(/ /g,'\\ ');
    console.log(fileName);
	var nextPageContent = fs.readFileSync('commands.html','utf-8');
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
	  	$('#output_text')[0].value = $('#output_text')[0].value.concat(data);
	  	$('#output_text')[0].value = $('#output_text')[0].value.slice();
	  	$('#output_text').scrollTop($('#output_text')[0].scrollHeight);
	});
	gdb.stderr.on('data', function (data) {
	  $('#output_text')[0].style.height = "450";
	  $('#errorMsg')[0].style.height = "70";
	  $('#errorBtn')[0].style.height = "70";
	  $('#ok')[0].style.height = "25";
	  $('#errorMsg')[0].textContent = data;
	});
	gdb.on('exit', function (code) {
	});
}

function performOperationWithValue(commandName,textBoxId){
	var textValue = jQuery(textBoxId)[0].value;
	gdb.stdin.write(commandName +' '+ textValue + '\n');
	jQuery(textBoxId)[0].value = '';
}

function performOperation(commandName){
	gdb.stdin.write(commandName + '\n');
}


function _quit(){
	gdb.stdin.write('quit' + '\n');
	gdb.stdin.end();
	var win = gui.Window.get();;
	win.on('close', function() {
  		this.hide(); // Pretend to be closed already
		this.close(true);
	});

	win.close();
	gui.Window.get(
  		window.open('index.html')
	);
}

function _reset(){
	$('#output_text')[0].style.height = "525";
	$('#errorMsg')[0].style.height = "0";
	$('#ok')[0].style.height = "0";
	$('#errorBtn')[0].style.height = "0";
	$('#errorMsg')[0].textContent = "";
}