const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);
const message = require('./welcome/message').message;

const welcome = (req, res) => {
  console.log("Received slash command " + req.body.command + " from " + req.body.user_id + " with " + req.body.text);

  const textPayload = req.body.text;
  const target_user = textPayload.substring(textPayload.lastIndexOf("@")+1, textPayload.lastIndexOf("|"));
  const actionRequest = target_user ? textPayload.substring(textPayload.indexOf(''),textPayload.lastIndexOf("<")-1) : req.body.text;
  const user_id = req.body.user_id;
  const team_id = req.body.team_id;
  const slashWelcome = true;
  const channel = target_user ? target_user : user_id;

  console.log("USER ID :: " + user_id);
  console.log("TARGET USER :: " + target_user);
  console.log("ACTION :: " + actionRequest);
  console.log("MESSAGE BODY :: " + textPayload);
  console.log("CHANNEL :: ", channel);

  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
     switch (actionRequest) {
       case 'test': {
         testMessage(team_id, channel);
         res.sendStatus(200);
         break;
       }
       /*case 'FOO': {
         fooMessage(team_id, channel, slashWelcome);
         res.sendStatus(200);
         break;
       }
       case 'python': {
         pythonMessage(team_id, channel, slashWelcome);
         res.sendStatus(200);
         break;
       }*/
       default: {
         helpMessage(team_id, channel);
         res.sendStatus(200);
         break;
       }
    }
  } else { res.sendStatus(503); }
};

const testMessage = (teamId, userId) => {
    // send the default message as a test DM to the requestor
    message.channel = userId;
    const params = qs.stringify(message);
    const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
    sendMessage.then(postResult);
  };

const helpMessage = (teamId, userId) => {
   help.channel = userId;
   const params = qs.stringify(help);
   const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
   sendMessage.then(postResult);
 }

const help = {
     token: process.env.SLACK_TOKEN,
     as_user: true,
     link_names: true,
     mrkdwn_in: ['text', 'pretext'],
     text: '*How to use /welcome*',
     attachments: JSON.stringify([
       {
         title: '/welcome is a command to greet users with the CB welcome message & Code of Conduct.',
         text: [ '* /welcome `test`: Sends a test welcome message as a DM to the user who typed it.',
                 '* /welcome `[resource name]`: Sends _"getting started in [resource x]"_ message as a DM to the user who typed it.',
                 '* /welcome `[command] @username`: Sends the result of the command (_test, resource, etc._) as a DM to the user specified.'
               ].join('\n'),
         color: '#74c8ed',
       }]),
   };

module.exports = { welcome };
