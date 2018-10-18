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

const errorSound = `<audio src="https://notificationsounds.com/sound-effects/strange-error-106/download/ogg">`
const successSound = `<audio src="https://notificationsounds.com/message-tones/filling-your-inbox-251/download/ogg">`
var userDict = [];


function printInfo() {
	console.log();
}

function WebhookProcessing(req, res) {
	 //Create an instance
	const agent = new WebhookClient({request: req, response: res});
	var intent = agent.intent;
	let origMess = agent.consoleMessages[agent.consoleMessages.length-1].text;
	console.log(origMess);
	console.log(agent.query);
	var ssml = `<speak>` + errorSound + `</audio>` + `</speak>`;

	switch(intent){
		case "Welcome Intent":
		  ssml = `<speak>Welcome to the Web<say-as interpret-as="characters">PT</say-as> Virtual Agent.</speak>`;
		case "print-form":
			console.log(agent.session);
			break;
		case "WebPT Objective Documentation":
			if (agent.parameters['vitals'] !== ""){
				let vitals_name = agent.parameters['vitals'];
				ssml = `<speak>` + successSound + origMess + `</audio>` + `</speak>`;
			} else {
				ssml = `<speak>` + errorSound + origMess + `</audio>` + `</speak>`;
			}
			break;
		case "WebPT Subjective Documentation":
			console.log(agent.parameters['number1']);
			let bodypart = agent.parameters['body-part'];
			if (agent.parameters['number1'] !== ""){
				ssml = `<speak>` + successSound + origMess + `</audio>` + `</speak>`;
			} else {
				ssml = `<speak>` + errorSound + `You are missing the value for the pain scale of ` + bodypart + `</audio>` + `</speak>`;
			}
		  break;
		case "WebPT Plan Documentation":
		  break;
		case "WebPT Assessment Documentation":
		  break;
    case "WebPT Objective Treatments":
			if (agent.parameters['duration'] !== ""){
				let duration = agent.parameters['duration'];
				ssml = `<speak>` + successSound + origMess + `</audio>` + `</speak>`;
			} else {
				ssml = `<speak>` + errorSound + origMess + `</audio>` + `</speak>`;
			}
		  break;
    case "play-sound":
		  ssml = `<speak> Error Sound:` + errorSound  + `Error sound was output.</audio>` +
			       `<break time="1s"/>` +
						 `Success Sound:` + successSound  + `Success sound was the output</audio>` +
						 `</speak>`;
			break;
		default:
		  break;
	}

	function respond(agent) {
		agent.add(ssml);
	}

	let intentMap = new Map();
	intentMap.set(intent, respond);
	agent.handleRequest(intentMap);
}


// Webhook
server.post('/webhook', function (req, res) {
  console.info(`\n\n>>>>>>> S E R V E R   H I T <<<<<<<`);
  WebhookProcessing(req, res);

});

server.listen((process.env.PORT || 8000), () => {
	console.log("Server is up and running...");
});
