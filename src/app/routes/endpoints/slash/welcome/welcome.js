const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);
const welcomeData = require('./../../../data/slash/welcome/slashWelcome.js').message;
const helpData = require('./../../../data/slash/welcome/welcomeHelp.js').help;
const incomingParser = require('./../../../../util/incomingParser.js');


const welcome = (req, res) => {
  console.log("Received slash command " + req.body.command + " from " + req.body.user_id + " with " + req.body.text);

  const recipients = incomingParser.parsePayload(req);
  console.log(recipients);

  console.log(`USER ID :: ${req.body.user_id}`);
  console.log(`TARGET USER :: ${recipients.target_user_id}`);
  console.log(`ACTION :: ${recipients.action}`);
  console.log(`MESSAGE BODY :: ${recipients.payload}`);
  console.log(`CHANNEL NAME :: ${recipients.target_channel_id}`);
  
  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
     switch (recipients.action) {
       case 'test':
        if (recipients.target_user_id && recipients.target_channel_id){
          console.log("this is a test");
          welcomeMessage(welcomeData, recipients.target_user_id);
          welcomeMessage(welcomeData, recipients.target_channel_id);
          res.sendStatus(200);
        } else {
         welcomeMessage(welcomeData, recipients.target_channel_id);
         res.sendStatus(200);
         break;
       }
       case 'post':
         if (recipients.target_user_id && recipients.target_channel_id){
           console.log("this is a double post");
           welcomeMessage(welcomeData, recipients.target_user_id);
           welcomeMessage(welcomeData, recipients.target_channel_id);
           res.sendStatus(200);
         } else {
          console.log("this is a single post");
          welcomeMessage(welcomeData, recipients.target_channel_id);
          res.sendStatus(200);
          break;
        }
        default: {
          console.log("this is a something else");
          console.log(helpData);
          helpMessage(helpData, recipients.target_channel_id);
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
   console.log("helpData: " + helpData);
   helpData.channel = target_channel_id;
   console.log("channel: " + helpData.channel);
   console.log("token: " + helpData.token);
   const params = qs.stringify(helpData);
   console.log(params);
   const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
   sendMessage.then(postResult);
 };

module.exports = { welcome };
