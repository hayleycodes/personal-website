const express = require('express');
const body_parser = require('body-parser');
const validator = require("email-validator");

const app = express();
app.use(express.static('templates'));
app.use(express.static('static'));
app.use(body_parser.json());

app.get('/', function (req, res) {
	res.send("Hello World!");
})

app.listen(3000, function() {
	console.log("Example app listening for cats");
});

var mailgun = require("mailgun-js");
var api_key = 'key-5f88a965cacbaa9907fc3a2f79083f7a';
var DOMAIN = 'hayleyavw.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});


app.post('/', function(req, res) {
	var email = req.body.email;
	if (validator.validate(email) == false) {
		return res.status(400).send();
	}
	var data = {
	  from: email,
	  to: 'hayleyavw@gmail.com',
	  subject: 'Message from ' + req.body.name,
	  text: req.body.message
	};

	mailgun.messages().send(data, function (error, body) {
	  console.log(body);
	});

	res.status(200).send();
})
