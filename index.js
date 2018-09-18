const express = require('express');
const bodyParser = require('body-parser');
const unirest = require('unirest');

const server = express();

server.use(bodyParser.urlencoded({
	extended: true
}));

server.use(bodyParser.json());

server.post('/webhook', (req, res) => {
	console.log(req);
	console.log(res);
	return res.json({
		speech: 'Something went wrong!',
		displayText: 'Something went wrong!',
		source: 'webhook'
	});
});

server.listen((process.env.PORT || 8000), () => {
	console.log("Server is up and running...");
});