const path = require('path');
const childProcess = require('child_process');
const phantomjs = require('phantomjs-prebuilt');

let childArgs = [
	path.join(__dirname, 'robot.js'),
	'<USER_EMAIL>',
	'<USER_PASSWORD>'
]

childProcess.execFile(
	phantomjs.path,
	childArgs,
	(err, stdout, stderr) => {
		if (err) {
			console.log(stderr);
			return;
		}

		let output = JSON.parse(stdout);

		if (output.error) {
			console.log(output.error);
			return;
		}

		console.log(output.data);
	});
