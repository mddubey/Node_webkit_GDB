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

var spawnDebugTask = function(fileName) {
	gdbDebugger.debugTask = spawn('gdb', ['-q', fileName]);

	gdbDebugger.debugTask.stdout.setEncoding('utf-8');
	gdbDebugger.debugTask.stderr.setEncoding('utf-8');

	gdbDebugger.debugTask.stdout.on('data', function(msg) {
		if (gdbDebugger.lastCommand === 'run') {
			if (msg.indexOf('Starting program:') === 0) return;
			var msgLines = msg.split('\n');
			var currentRunningLineNumber = msgLines[2].split('\t')[0];
			interface.showCurrentRunningLine(currentRunningLineNumber);
		}
		if (gdbDebugger.lastCommand === 'continue') {
			if (msg === 'Continuing.\n') return;
			var msgLines = msg.split('\n');
			var currentRunningLineNumber = msgLines[msgLines.length - 2].split('\t')[0];
			interface.showCurrentRunningLine(currentRunningLineNumber);
		}
		if (gdbDebugger.lastCommand === 'step') {
			var msgLines = msg.split('\n');
			var currentRunningLineNumber = msgLines[msgLines.length - 2].split('\t')[0];
			interface.showCurrentRunningLine(currentRunningLineNumber);
		}
		if (gdbDebugger.lastCommand === 'print') {
			if(msg === '(gdb) ') return;
			var msgLines = msg.split('\n');
			var words = msgLines[0].split(' ');
			var result = words[words.length - 1];
			interface.onExpressionrResult(result);
		}
		gdbDebugger.lastCommand = '';
	});

	gdbDebugger.debugTask.stderr.on('data', function(errorMsg) {
		console.log(errorMsg)
		if(gdbDebugger.lastCommand === 'print'){
			interface.onExpressionrError(errorMsg);
			return;
		};
		require('fs').appendFile('./error.log', errorMsg + '\n');
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
	gdbForList.stdin.write('list 1\n');
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

gdbDebugger.stepInto = function() {
	processCommand('step');
};

gdbDebugger.evaluate = function(expression) {
	processCommand('print ' + expression);
};

gdbDebugger.next = function() {
	processCommand('next');
};

gdbDebugger.finish = function() {
	processCommand('finish');
};