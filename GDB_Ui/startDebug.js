function debug () {
    spawn = require('child_process').spawn;
    var fileName = $('#exeFile')[0].value;
    fileName = fileName.replace(/\\/g,'/');
    console.log(fileName);
	var ls    = spawn('gdb', [fileName]); // the second arg is the command 
                                          // options

	ls.stdout.on('data', function (data) {    // register one or more handlers
	  document.write(data);
	});

	ls.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	ls.on('exit', function (code) {
	});
}