var interface = {};
var gui = require('nw.gui');

var generateTableHtml = function(prev, nextLine, index) {
	var linePartes = nextLine.split('\t');
	var lineNumber = linePartes[0];
	linePartes[0] = '';
	var codeInLine = linePartes.join('&nbsp;&nbsp;&nbsp;');
	var trHtml = '<tr><td data-line="VALUE" class="lineNumber">LINE</td><td>CODE</td></tr>';
	trHtml = trHtml.replace('LINE', index + 1).replace('VALUE', lineNumber).replace('CODE', codeInLine);
	return prev + trHtml;
};

interface.onFullCode = function(fullCodeContent) {
	var codeLines = fullCodeContent.split('\n');
	var tbody = codeLines.reduce(generateTableHtml, '');
	jQuery('#codeWindow').html(tbody);
};

interface.onGenericError =  function(errorMsg){
	var error = jQuery('#error');
	error.find('p').text(errorMsg);
	error.show();
}

interface.showCurrentRunningLine = function(currentRunningLineNumber) {
	jQuery('.currentLine').removeClass('currentLine');
	var currentLine = jQuery('td[data-line="' + currentRunningLineNumber + '"').parent();
	currentLine.addClass('currentLine');
	jQuery('#evaluate').prop('disabled',false);
};

interface.onDebugFinished = function() {
	jQuery('.currentLine').removeClass('currentLine');
	jQuery('#evaluate').prop('disabled', true);
};

interface.onExpressionrResult = function(result) {
	jQuery('#result').val(result);
	jQuery('#result').css({
		color: 'green'
	});
};

interface.onExpressionrError = function(errorMsg) {
	jQuery('#result').val(errorMsg);
	jQuery('#result').css({
		color: 'red'
	});
}

interface.onQuitProcessed = function(){
	gui.Window.get().close();
}

interface.init = function() {
	var loadSymbolsFromFile = function() {
		jQuery('#loadFile').hide();
		jQuery('#main').show();
		var fileName = jQuery('#exeFile input')[0].value;
		fileName = fileName.replace(/\\/g, '/').replace(/ /g, '\\ ');
		gdbDebugger.loadSymboles(fileName);
	};

	var manageBreakPoint = function() {
		var td = jQuery(this);
		var lineNumber = td.data('line');
		if (td.parent().hasClass('breakpoint')) {
			gdbDebugger.removeBreakPoint(lineNumber);
			td.parent().removeClass('breakpoint');
			return;
		}
		gdbDebugger.insertBreakPoint(lineNumber);
		td.parent().addClass('breakpoint');
	};

	var showEvaluateWindow = function() {
		jQuery('#evaluateWindow').show();
	}

	jQuery('#loadExe').click(loadSymbolsFromFile);

	jQuery('#codeWindow').on('click', '.lineNumber', manageBreakPoint);

	jQuery('#run').click(gdbDebugger.run);
	jQuery('#continue').click(gdbDebugger.continue);
	jQuery('#step').click(gdbDebugger.stepInto);
	jQuery('#finish').click(gdbDebugger.finish);
	jQuery('#next').click(gdbDebugger.next);
	jQuery('#quit').click(gdbDebugger.quit);
	jQuery('#evaluate').click(showEvaluateWindow);

	jQuery('#expression').on('keydown', function(e) {
		if (e.keyCode === 13)
			gdbDebugger.evaluate($(this).val().trim());
	});

	$(".ui-closable-tab").click(function() {
		jQuery(this).parent().hide();
	});

	jQuery('#evaluateWindow').draggable({
		appendTo: "body"
	});
	fs = require('fs');
	fs.closeSync(fs.openSync('./error.log', 'w'));
};

jQuery(document).ready(interface.init);