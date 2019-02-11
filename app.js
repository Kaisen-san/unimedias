const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const childProcess = require('child_process');
const phantomjs = require('phantomjs-prebuilt');
const port = process.env.port || 4000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let subjects = [];

app.get('/', (req, res) => res.render('pages/index'));

app.get('/login', (req,res) => res.render('pages/main', { 'subjects': subjects }));

app.post('/login', (req, res) => {
	let childArgs = [
		path.join(__dirname, 'robot.js'),
		req.body.email,
		req.body.pass
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
			
			subjects = output.data;
			res.redirect('/login');
		});
});

const server = app.listen(port);
console.log(`Express server listening at port ${server.address().port}`);
