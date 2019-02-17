"use strict";

var system = require('system');
var page = require('webpage').create();
var loginUrl = 'https://www2.maua.br/mauanet.2.0';
var reportUrl = 'https://www2.maua.br/mauanet.2.0/boletim-escolar';

if (system.args.length < 3) {
	console.log(JSON.stringify({ 'error': 'Few arguments to start the robot' }));
	phantom.exit();
}

var formData = 'maua_email=' + system.args[1] + '&maua_senha=' + system.args[2];

page.open(loginUrl, 'post', formData, function (status) {
	if (status !== 'success') {
		console.log(JSON.stringify({ 'error': 'Unable to reach login page!' }));
		phantom.exit();
	}

	var isLogged  = page.evaluate(function() {
		return document.querySelector('#form_mauanet_login') === null;
	});

	if (!isLogged) {
		console.log(JSON.stringify({ 'error': 'Invalid email and/or password!' }));
		phantom.exit();
	}

	page.open(reportUrl, function (status) {
		if (status !== 'success') {
			console.log(JSON.stringify({ 'error': 'Unable to load report page!' }));
			phantom.exit();
		}

		var data = page.evaluate(function() {
			var table = document.querySelector('#notas');
			var subjects = {};

			if (!table) {
				return { 'error': 'Unable to find report element!' };
			}

			for (var i = 1; i < table.rows.length - 2; i++) {
				var subject = table.rows[i].cells[0].innerText.trim();
				var categories = {};

				for (var j = 1; j < table.rows[i].cells.length; j++) {
					var category = table.rows[0].cells[j].innerText.trim();
					var value = table.rows[i].cells[j].innerText.trim();

					categories[category] = value;
				}

				subjects[subject] = categories;
			}

			return subjects;
		});

		if (data.error) {
			console.log(JSON.stringify({ 'error': data.error }))
		}
		else {
			console.log(JSON.stringify({ 'subjects': data }));
		}

		phantom.exit();
	});
});
