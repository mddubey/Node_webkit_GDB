var interface = {};

interface.onFullCode = function(fullCodeContent) {
	var codeLines = fullCodeContent.split('\n');
	var tbody = '';
	codeLines = codeLines.map(function(line) {
		var linePartes = line.split('\t');
		var lineNumber = linePartes[0];
		linePartes[0] = '';
		var codeInLine = linePartes.join('&nbsp;&nbsp;&nbsp;');
		return {
			lineNumber: lineNumber,
			codeInLine: codeInLine
		};
	});
	codeLines.forEach(function(line, index) {
		var trHtml = '<tr><td data-line="VALUE">LINE</td><td>CODE</td></tr>';
		trHtml = trHtml.replace('LINE', index + 1).replace('VALUE', line.lineNumber).replace('CODE', line.codeInLine);
		tbody += trHtml;
	});
	// console.log(tbody)
	jQuery('#codeWindow').html(tbody);
}