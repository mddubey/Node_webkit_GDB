var interface = {};

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

interface.showCurrentRunningLine = function(currentRunningLineNumber) {
	jQuery('.currentLine').removeClass('currentLine');
	jQuery('td[data-line="' + currentRunningLineNumber + '"').parent().addClass('currentLine');
};


interface.init = function() {
	var loadSymbolsFromFile = function() {
		jQuery('#loadFile').hide();
		var fileName = jQuery('#exeFile')[0].value;
		fileName = fileName.replace(/\\/g, '/').replace(/ /g, '\\ ');
		gdbDebugger.loadSymboles(fileName);
	};

	var manageBreakPoint = function() {
		var td = jQuery(this);
		var lineNumber = td.data('line');
		if (td.parent().hasClass('breakpoint')) {
			gdbDebugger.removeBreakPoint(lineNumber);
			td.parent().removeClass('breakpoint');
			return
		}
		gdbDebugger.insertBreakPoint(lineNumber);
		td.parent().addClass('breakpoint');
	};

	jQuery('#loadExe').click(loadSymbolsFromFile);

	jQuery('#codeWindow').on('click', '.lineNumber', manageBreakPoint);

	jQuery('#run').click(gdbDebugger.run);
	jQuery('#continue').click(gdbDebugger.continue);
	jQuery('#step').click(gdbDebugger.stepInto);

};

jQuery(document).ready(interface.init);