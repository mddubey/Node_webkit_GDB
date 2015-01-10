var interface = {};

interface.onFullCode = function(fullCodeContent) {
	var codeLines = fullCodeContent.split('\n');
	codeLines = codeLines.map(function(line) {
		var linePartes = line.split('\t');
		var lineNumber = linePartes[0];
		var codeInLine = linePartes.slice(1).join('\t');
		return {
			lineNumber: lineNumber,
			codeInLine: codeInLine
		};
	});
	jQuery('#codeWindow').text(fullCodeContent);
}