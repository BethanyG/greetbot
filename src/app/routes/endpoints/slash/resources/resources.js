const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);

const resourcesData = require('util/ymlLoader.js').resourcesData;

const helpData = require('routes/data/slash/resources/resourcesHelp.js').help;
const resourcesTemplateMessage = require('routes/data/slash/resources/resourcesMessage.js').message;
const genericResourcesAttachmentTemplate = require('routes/data/slash/resources/genericResourcesAttachmentTemplate.js').generateResourcesMessage;
const incomingParser = require('util/incomingParser.js');

const resources = async (req, res) => {
  console.log(`Received slash command ${req.body.command} from ${req.body.user_id} with ${req.body.text}.`);

  const parsedCommand = await incomingParser.parsePayload(req);

  console.log(`parsedCommand is ${parsedCommand}`);

  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    switch (parsedCommand.action) {
      case 'list': {
        let title;
        let attachments;
        if (!parsedCommand.action_arguments.length) {
          title = "*Here is the full list of resources:*";
          attachments = genericResourcesAttachmentTemplate(resourcesData.resources);
        } else {
          const filteredResources = resourcesData.resources.filter(resource => {
            return !(!parsedCommand.action_arguments.includes(resource.language.toLowerCase()) ||
                    !parsedCommand.action_arguments.includes(resource.level.toLowerCase()));
          });
          title = `*Here are the topics for ${parsedCommand.action_arguments.join(" ")}*`;
          attachments = genericResourcesAttachmentTemplate(filteredResources);
        }
        filterAndPostResults(parsedCommand.target_channel_id, parsedCommand.target_user_id, resourceMessage, resourcesTemplateMessage, title, attachments);
        res.sendStatus(200);
        break;
      }
      case 'post': {
        filterAndPostResults(parsedCommand.target_channel_id, parsedCommand.target_user_id, helpMessage, helpData);
        res.sendStatus(200);
        break;
      }
      default: {
        filterAndPostResults(parsedCommand.target_channel_id, parsedCommand.target_user_id, helpMessage, helpData);
        res.sendStatus(200);
      }
    }
  } else {
    res.sendStatus(503);
  }
};

const helpMessage = (helpData, target_channel_id, title, attachments) => {
  if (title) {
    helpData.text = title;
  }
  if (attachments) {
    helpData.attachments = JSON.stringify(attachments);
  }
  helpData.channel = target_channel_id;
  const params = qs.stringify(helpData);
  const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
  sendMessage.then(postResult);
};

const resourceMessage = (resourcesTemplateMessage, target_channel_id, title, attachments) => {
  if (title) {
    resourcesTemplateMessage.text = title;
  }
  if (attachments) {
    resourcesTemplateMessage.attachments = JSON.stringify(attachments);
  }
  resourcesTemplateMessage.channel = target_channel_id;
  const params = qs.stringify(resourcesTemplateMessage);
  const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
  sendMessage.then(postResult);
}

const filterAndPostResults = (channels, users, callback, data, title = '', attachments = '') => {
  const common = channels.filter(common_id => users.includes(common_id));
  channels.forEach(channel_id => {
    if (!common.includes(channel_id)) {
      callback(data, channel_id, title, attachments);
    }
  });
  users.forEach(user_id => {
    if (!common.includes(user_id)) {
      callback(data, user_id, title, attachments);
    }
  });
  common.forEach(common_id => {
    callback(data, common_id, title, attachments);
  });
}

module.exports = { resources };
