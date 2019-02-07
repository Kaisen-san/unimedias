"use strict";

var system = require('system');
var page = require('webpage').create();
var loginUrl = 'https://www2.maua.br/mauanet.2.0';
var boletimUrl = 'https://www2.maua.br/mauanet.2.0/boletim-escolar/index/c/1';

if (system.args.length < 3) {
	console.log(JSON.stringify({'error': 'Please inform user and password!'}));
	phantom.exit();
}

var formData = 'maua_email=' + system.args[1] + '&maua_senha=' + system.args[2];

page.open(loginUrl, 'post', formData, function (status) {
	if (status !== 'success') {
		console.log(JSON.stringify({'error': 'Login failed!'}));
		phantom.exit();
	}

	page.open(boletimUrl, function (status) {
		if (status !== 'success') {
			console.log(JSON.stringify({'error': 'Unable to load boletim!'}));
			phantom.exit();
		}

		var data = page.evaluate(function() {
			var table = document.querySelector('#notas');
			var subjects = {};

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

		console.log(JSON.stringify({'data': data}));
		phantom.exit();
	});
});
