var interface = {};

interface.onFullCode = function(fullCodeContent) {
	var codeLines = fullCodeContent.split('\n');
	var tbody = '';
	codeLines.forEach(function(line, index) {
		var linePartes = line.split('\t');
		var lineNumber = linePartes[0];
		linePartes[0] = '';
		var codeInLine = linePartes.join('&nbsp;&nbsp;&nbsp;');
		var trHtml = '<tr><td data-line="VALUE" class="breakpoint">LINE</td><td>CODE</td></tr>';
		trHtml = trHtml.replace('LINE', index + 1).replace('VALUE', lineNumber).replace('CODE', codeInLine);
		tbody += trHtml;
	});
	jQuery('#codeWindow').html(tbody);
};