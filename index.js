const express = require('express');
const bodyParser = require('body-parser');
const unirest = require('unirest');
const pg = require("pg");
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

const dbConnection = "postgres://meyuzbrp:r4lyWHV96f_X9ouOtZESXsxOOpb_p-TQ@tantor.db.elephantsql.com:5432/meyuzbrp";

const errorSound = `<audio src="https://notificationsounds.com/sound-effects/strange-error-106/download/ogg">`
const successSound = `<audio src="https://notificationsounds.com/message-tones/filling-your-inbox-251/download/ogg">`
const sessions = [];
const forms = [];

function WebhookProcessing(req, res) {
	 //Create an instance
	const agent = new WebhookClient({request: req, response: res});
	var intent = agent.intent;
	let origMess = agent.consoleMessages[agent.consoleMessages.length-1].text;
	console.log(origMess);
	var ssml = `<speak>` + errorSound + `</audio>` + `</speak>`;

	switch(intent){
		case "Welcome Intent":
		  ssml = `<speak>Welcome to the Web<say-as interpret-as="characters">PT</say-as> Virtual Agent.</speak>`;
			console.log(agent.session);
			break;
		case "WebPT Conversation":
			sessions[agent.session] = {
				givenName: agent.parameters['given-name'],
				lastName: agent.parameters['last-name']
			}
			ssml = origMess;
			break;
		case "print-form":
			console.log(forms);
			ssml = origMess;
			break;
		case "WebPT Objective Documentation":
			let name = agent.session;
			let now1 = Date().toString();
			let vitals_name = agent.parameters['vitals'];
			let metric1 = agent.parameters['number'];
			if (vitals_name !== ""){
				ssml = `<speak>` + successSound + origMess + `</audio>` + `</speak>`;
				if (agent.parameters['number'] !== ""){
					ssml = `<speak>` + successSound + origMess + `</audio>` + `</speak>`;
					if(forms[name] === undefined){
						forms[name] = {
							firstName: sessions[agent.session].givenName,
							lastName: sessions[agent.session].lastName,
							info: []
						};
						forms[name].info.push({
							date: now1,
							vital: vitals_name,
							measure: metric1,
						});
					} else {
						forms[name].info.push({
							date: now1,
							vital: vitals_name,
							measure: metric1
						});
					}
				} else {
					ssml = `<speak>` + errorSound + origMess + `</audio>` + `</speak>`;
				}
			}
			break;
		case "WebPT Subjective Documentation":
			let metric = agent.parameters['number1'];
			let now = Date().toString();
			let bodypart = agent.parameters['body-part'];
			let name1 = agent.session;
			if (agent.parameters['number1'] !== ""){
				ssml = `<speak>` + successSound + origMess + `</audio>` + `</speak>`;
				if(forms[name1] === undefined){
					forms[name1] = {
						firstName: sessions[agent.session].givenName,
						lastName: sessions[agent.session].lastName,
						info: []
					};
					forms[name1].info.push({
						date: now,
						vital: bodypart,
						measure: metric
					});
				} else {
					forms[name1].info.push({
						date: now,
						vital: bodypart,
						measure: metric
					});
				}
			} else {
				ssml = `<speak>` + errorSound + `You are missing the value for the pain scale of ` +
							bodypart + `</audio>` + `</speak>`;
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
		  ssml = `<speak> Error Sound` + errorSound  + ` ...</audio>` +
			       `<break time="1s"/>` +
						 `Success Sound` + successSound  + ` ...</audio>` +
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
