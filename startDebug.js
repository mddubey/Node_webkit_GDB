var gdbDebugger = {};
gdbDebugger.lastCommand = '';
spawn = require('child_process').spawn;

var NOT_BEING_RUN_ERROR_MSG = 'The program is not being run.';

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

var showCurrentRunningLineIfPresent = function(msg, breakLineNumber, breakFromEnd){
	var msgLines = msg.split('\n');
	if(breakFromEnd){
		breakLineNumber = msgLines.length - breakLineNumber;
	}
	var currentRunningLineNumber = msgLines[breakLineNumber].split('\t')[0];
	if (isNaN(currentRunningLineNumber)) {
		interface.onDebugFinished();
		return;
	};
	interface.showCurrentRunningLine(currentRunningLineNumber);
}

var spawnDebugTask = function(fileName) {
	gdbDebugger.debugTask = spawn('gdb', ['-q', fileName]);

	gdbDebugger.debugTask.stdout.setEncoding('utf-8');
	gdbDebugger.debugTask.stderr.setEncoding('utf-8');

	gdbDebugger.debugTask.stdout.on('data', function(msg) {
		if(msg.trim() === '(gdb)') return;
		if (gdbDebugger.lastCommand === 'run') {
			if (msg.indexOf('Starting program:') === 0) return;
			if (msg.trim().indexOf('Breakpoint') !== 0){
				interface.onGenericError("Please set atleast one Breakpoint, before running the debugger");
				return;
			}
			showCurrentRunningLineIfPresent(msg, 2, false);
		}
		if (gdbDebugger.lastCommand === 'continue') {
			if (msg === 'Continuing.\n') return;
			showCurrentRunningLineIfPresent(msg, 2, true);
		}
		if (gdbDebugger.lastCommand === 'step') {
			showCurrentRunningLineIfPresent(msg, 2, true);
		}
		if (gdbDebugger.lastCommand === 'print') {
			var msgLines = msg.split('\n');
			var words = msgLines[0].split(' ');
			var result = words[words.length - 1];
			interface.onExpressionrResult(result);
		}
		gdbDebugger.lastCommand = '';
	});

	gdbDebugger.debugTask.stderr.on('data', function(errorMsg) {
		if (errorMsg.trim() === NOT_BEING_RUN_ERROR_MSG) {
			interface.onGenericError(NOT_BEING_RUN_ERROR_MSG);
			return;
		};
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

gdbDebugger.quit = function() {
	processCommand('quit');
	setTimeout(function() {
		gdbDebugger.debugTask.kill();
		interface.onQuitProcessed();
	},1000);
};