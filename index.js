const express = require('express');
const bodyParser = require('body-parser');
const unirest = require('unirest');
const {
	dialogflow,
	Image
} = require('actions-on-google')
const { 
	WebhookClient,
	Card,
	Suggestion
	} = require('dialogflow-fulfillment');

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.use(bodyParser.json());

function WebhookProcessing(req, res) {
	//Create an instance
	const agent = new WebhookClient({request: req, response: res});
	console.log(agent);
	
	function flight(agent) {
		agent.add("Hello World");
	}
	
	let intentMap = new Map();
	intentMap.set('flight', flight);
	agent.handleRequest(intentMap);
});

// Webhook
app.post('/webhook', function (req, res) {
    console.info(`\n\n>>>>>>> S E R V E R   H I T <<<<<<<`);
    WebhookProcessing(req, res);
});

server.listen((process.env.PORT || 8000), () => {
	console.log("Server is up and running...");
});