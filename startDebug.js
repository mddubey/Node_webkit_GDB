var gdbDebugger = {};
var gui = require('nw.gui');
gdbDebugger.lastCommand = '';
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
		if(gdbDebugger.lastCommand === 'run'){
			if(msg.indexOf('Starting program:') === 0) return;
			var msgLines = msg.split('\n');
			var currentRunningLineNumber = msgLines[2].split('\t')[0];
			interface.showCurrentRunningLine(currentRunningLineNumber);
		}
		if(gdbDebugger.lastCommand === 'continue'){
			console.log(msg);
			var msgLines = msg.split('\n');
			var currentRunningLineNumber = msgLines[3].split('\t')[0];
			interface.showCurrentRunningLine(currentRunningLineNumber);
		}
			gdbDebugger.lastCommand = '';
	});

	gdbDebugger.debugTask.stderr.on('data', function(errorMsg) {
		require('fs').writeFile('./error.log',errorMsg+'\n\n\n');
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
	gdbDebugger.lastCommand = command.split(' ')[0];
}

gdbDebugger.insertBreakPoint = function(lineNumber) {
	processCommand('break ' + lineNumber);
};

gdbDebugger.removeBreakPoint = function(lineNumber) {
	processCommand('clear ' + lineNumber);
};

gdbDebugger.run = function() {
	processCommand('run');
};

gdbDebugger.continue = function() {
	processCommand('continue');
};