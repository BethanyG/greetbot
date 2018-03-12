const axios = require('axios');
const postResult = result => console.log(result.data);
const qs = require('querystring');


const parsePayload = async (req) => {
  const textPayload = req.body.text.trim();

  //team_id of the Slack team where the app is installed.  Used for Auth.
  const team_id = req.body.team_id;

  //user_id of the @<user_name> typed with the slash command (if any).
  // Extracts all user ids
  let target_user_id_array = [];
  const userIdRegexp = /@(.*?)\|/g;
  let userMatch;
  userMatch = userIdRegexp.exec(textPayload);
  while (userMatch != null) {
    console.log(userMatch[1]);
    target_user_id_array.push(await findDmChannel(userMatch[1]));
    userMatch = userIdRegexp.exec(textPayload);
  }

  //public/private channel_id typed with the slash command (if any).
  //Msgs sent here will be in-channel, and the bot_user needs permissions/join for it.
  // Extracts all channels
  let target_channel_id_array = [];
  const channelIdRegexp = /#(.*?)\|/g;
  let channelMatch;
  channelMatch = channelIdRegexp.exec(textPayload);
  while (channelMatch != null) {
    target_channel_id_array.push(channelMatch[1]);
    channelMatch = channelIdRegexp.exec(textPayload);
  }

  // Remove any usernames or channels, and extract keywords from the rest.
  // Check against a list of predefined keywords.
  const remaining_text = textPayload.replace(/<.*?>/g, '').replace(/ +/g, ' ').toLowerCase().split(" ");
  let action_keywords = [];
  let action_arguments = [];
  remaining_text.forEach(word => {
    if (['test', 'list', 'post'].includes(word)) {
      action_keywords.push(word);
    } else {
      action_arguments.push(word);
    }
  });

  if (action_keywords.length > 1) {
    action_keywords = [];
  }
  console.log(action_arguments.length)
  if (action_arguments.length === 1 && action_arguments[0] === "") {
    action_arguments = {};
  } else {
    action_arguments = sortArguments(action_arguments);
  }
  console.log(action_arguments)

  //user_id of the user who typed the slash command
  //If no other info is specified, the Msg should go back to this user on the DM channel_id.
  const default_user_id = await findDmChannel(req.body.user_id);

  //The DM channel id. Default if no target_channel_id is specified.
  //Msgs sent here will come from the bot_user as a DM.
  const default_channel_id = req.body.channel_id;


  // Return object
  // If both channel(s) and user(s) have been specified,
  // return both arrays as is
  if (target_channel_id_array.length && target_user_id_array.length) {
    return { target_user_id: target_user_id_array, target_channel_id: target_channel_id_array, action: action_keywords[0], action_arguments: action_arguments, payload: textPayload }
  }
  // If only user(s) have been specified,
  // set the target channel array to the user ids
  else if (!target_channel_id_array.length && target_user_id_array.length) {
    return { target_user_id: target_user_id_array, target_channel_id: target_user_id_array, action: action_keywords[0], action_arguments: action_arguments, payload: textPayload }
  }
  // If only channel(s) have been specified,
  // no action is necessary on the arrays
  else if (target_channel_id_array.length && !target_user_id_array.length) {
    return { target_user_id: target_user_id_array, target_channel_id: target_channel_id_array, action: action_keywords[0], action_arguments: action_arguments, payload: textPayload }
  }
  // Finally, if no channels or users,
  // add the requested user's id as target channel,
  // to receive the message as a DM
  else {
    target_user_id_array.push(default_user_id);
    return { target_user_id: target_user_id_array, target_channel_id: target_user_id_array, action: action_keywords[0], action_arguments: action_arguments, payload: textPayload }
  }

};


const findDmChannel = async (userId) => {
  const dmRequest = {token: process.env.SLACK_TOKEN, user: userId };
  const params = qs.stringify(dmRequest);
  const sendDmRequest = axios.post('https://slack.com/api/im.open', params);
  const req_id = sendDmRequest.then(result => {
                  /*console.log(result.data.channel.id);*/
                  return result.data.channel.id;
                })
               .catch(error => console.log(error));

  return req_id;
};

const sortArguments = (req_arguments) => {
  let languages = [];
  let levels = [];
  let types = [];
  let costs = [];
  req_arguments.forEach(argument => {
    console.log(argument);
    switch (argument.toLowerCase()) {
      // languages sort
      case 'javascript':
      case 'js': {
        languages.push("javascript");
        break;
      }
      case 'python': {
        languages.push("python");
        break;
      }
      case 'ruby': {
        languages.push("ruby");
        break;
      }

      // levels sort
      case 'beginner':
      case 'beg': {
        levels.push("beginner");
        break;
      }
      case 'intermediate':
      case 'int':
      case 'inter': {
        levels.push("intermediate");
        break;
      }
      case 'advanced':
      case 'adv':
      case 'moar': {
        levels.push("advanced");
        break;
      }

      // types sort
      case 'book': {
        types.push("book");
        break;
      }
      case 'tutorial': {
        types.push("tutorial");
        break;
      }
      case 'class': {
        types.push("class");
        break;
      }
      case 'video': {
        types.push("video");
        break;
      }

      // costs sort
      case 'free': {
        costs.push('free');
        break;
      }
      case 'paid': {
        costs.push('paid');
        break;
      }
    }
  });
  let returnArgs = {};
  if (languages.length) {
    returnArgs["language"] = languages;
  }
  if (levels.length) {
    returnArgs["level"] = levels;
  }
  if (types.length) {
    returnArgs["media-type"] = types;
  }
  if (costs.length) {
    returnArgs["media-cost-desc"] = costs;
  }
  return returnArgs;
}

module.exports = { parsePayload };
