var init = function() {
	jQuery('#loadExe').click(function() {
		jQuery('#loadFile').hide();
		var fileName = jQuery('#exeFile')[0].value;
		fileName = fileName.replace(/\\/g, '/').replace(/ /g, '\\ ');
		loadSymboles(fileName);
	});

	jQuery('#codeWindow').on('td.breakpoint', 'click', function() {
		alert($(this).data('line'));
	});

};

jQuery(document).ready(init);