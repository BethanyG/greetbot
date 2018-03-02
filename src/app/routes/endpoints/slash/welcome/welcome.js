const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);
const welcomeData = require('./../../../data/slash/welcome/slashWelcome.js').message;
const helpData = require('./../../../data/slash/welcome/welcomeHelp.js').help;
const incomingParser = require('./../../../../util/incomingParser.js');


const welcome = (req, res) => {
  console.log("Received slash command " + req.body.command + " from " + req.body.user_id + " with " + req.body.text);
  console.log("INCOMING PARSER");
  
  console.log(req.body);
  const textPayload = req.body.text.trim();
  console.log("text Payload:" + textPayload);
  //team_id of the Slack team where the app is installed.  Used for Auth.
  const team_id = req.body.team_id;
  console.log(team_id);

  //user_id of the @<user_name> typed with the slash command (if any).
  const target_user_id = textPayload.substring(textPayload.lastIndexOf("@")+1, textPayload.lastIndexOf("|"));
  console.log("Target user Id:" + target_user_id);

  //public/private channel_id typed with the slash command (if any).
  //Msgs sent here will be in-channel, and the bot_user needs permissions/join for it.
  const target_channel_id = textPayload.substring(textPayload.lastIndexOf("#")+1, textPayload.indexOf("|"));
  console.log("Target channel Id:" + target_channel_id);

  //The command word (if any) typed.
  //If there's no legitimate command (or if it's blank), sent Msg should default to "help".
  const action_request = target_user_id || target_channel_id ? textPayload.substring(textPayload.indexOf(''),textPayload.indexOf("<")-1) : req.body.text;
  console.log("Action request:" + action_request);

  //user_id of the user who typed the slash command
  //If no other info is specified, the Msg should go back to this user on the DM channel_id.
  const default_user_id = req.body.user_id;
  console.log("Default user id:" + default_user_id);

  //The DM channel id. Default if no target_channel_id is specified.
  //Msgs sent here will come from the bot_user as a DM.
  const default_channel_id = 'D8ZU7NZPE'

  const parsedList = { team_id, target_user_id, target_channel_id, action_request, default_user_id, default_channel_id };
  console.log("ParsedList:" + parsedList);
  
  const findDmChannel = (userId, default_channel_id) => {
  const dmRequest = {token: process.env.SLACK_TOKEN, user: userId };
  const params = qs.stringify(dmRequest);
  const sendDmRequest = axios.post('https://slack.com/api/im.open', params);
  sendDmRequest.then(result => { console.log(result); return result; });
  }
  
  switch (parsedList){
    //If there isIn  a target user and channel, send both.
    // channel=yes AND DM=yes....so two seperate messages here?!??!)
    case (target_channel_id && target_user_id): {


      const target_user_dm_chan = findDmChannel(target_user_id, default_channel_id);
      console.log( "option 1:" + { target_user_id: target_user_dm_chan, target_channel_id: target_channel_id, action: action_request, payload: textPayload });
    }

    //If there is a target user only, send target_user_dm_chan and omit the default_channel_id
    case (target_user_id && !target_channel_id): {

      const target_user_dm_chan = findDmChannel(target_user_id, default_channel_id);
      console.log( { "option 2:" + target_user_id: target_user_dm_chan, target_channel_id: '', action: action_request, payload: textPayload });
    }

    //If there is a target channel only, send tartget_channel_id and omit default_user_id
    case (target_channel_id && !target_user_id): {
      console.log( { target_user_id: '', target_channel_id: target_channel_id, action: action_request, payload: textPayload });
    }

    //send default_channel_id
    //message will be a DM uder Applications as the bot_user
    default: {
      console.log( { target_user_id: '', target_channel_id: default_channel_id, action: action_request, payload: textPayload } );
    }
  }
    
    
  const recipients = incomingParser.parsePayload(req);
  console.log("request: " + req);
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
   helpData.as_user = false;
   helpData.channel = `D9FAMELAY`;
   const params = qs.stringify(helpData);
   const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
   sendMessage.then(postResult);
 };

module.exports = { welcome };
