const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);
const welcomeData = require('./../../../data/slash/welcome/slashWelcome');
const helpData = require('./../../../data/slash/welcome/welcomeHelp');
const incomingParser = require('./../../../../util/incomingParser');


const welcome = (req, res) => {
  console.log("Received slash command " + req.body.command + " from " + req.body.user_id + " with " + req.body.text);

  const { target_user_id, target_channel_id, action, payload } = incomingParser.parsePayload(req);

  console.log(`USER ID :: ${user_id}`);
  console.log(`TARGET USER :: ${target_user_id}`);
  console.log(`ACTION :: ${action_request}`);
  console.log(`MESSAGE BODY :: ${textPayload}`);
  console.log(`CHANNEL NAME :: ${channel_id}`);

  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
     switch (action_request) {
       case 'test':
        if (target_user_id && target_channel_id){
          welcomeMessage(welcomeData, target_user_id);
          welcomeMessage(welcomeData, target_channel_id);
          res.sendStatus(200);
        }
        } else {
         welcomeMessage(welcomeData, target_channel_id);
         res.sendStatus(200);
         break;
       }
       case 'post': {
         if (target_user_id && target_channel_id){
           welcomeMessage(welcomeData, target_user_id);
           welcomeMessage(welcomeData, target_channel_id);
           res.sendStatus(200);
         }
         } else {
          welcomeMessage(welcomeData, target_channel_id);
          res.sendStatus(200);
          break;
        }
        default {
          helpMessage(helpData, target_channel_id);
          res.sendStatus(200);
        }
    }
  } else { res.sendStatus(503); }
};



const welcomeMessage = ( welcomeData, target_channel_id ) => {
   welcomeData.channel = target_channel_id;
   const params = qs.stringify(welcomeData);
   const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
   sendMessage.then(postResult);
 }

 const helpMessage = (helpData, target_channel_id) => {
   helpData.channel = target_channel_id;
   const params = qs.stringify(helpData);
   const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
   sendMessage.then(postResult);
 };

module.exports = { welcome };
