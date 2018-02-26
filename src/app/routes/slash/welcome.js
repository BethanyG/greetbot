const axios = require('axios');
const qs = require('querystring');
const postResult = result => console.log(result.data);

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

const message = {
      token: process.env.SLACK_TOKEN,
      as_user: true,
      link_names: true,
      mrkdwn_in: ['text', 'pretext'],
      attachments: JSON.stringify([
        {
          pretext: '*Welcome!* _We\'re glad you\'re here._\n\n:question: *What exactly is CodeBuddies?* :question:\n\n\nWe\’re a community of independent code learners sharing knowledge &amp; helping each other learn faster.  We\'re 100% volunteer.  Our website, <https://codebuddies.org/|CodeBuddies.org> is open-sourced &amp; welcomes contributions on <https://www.github.com/codebuddiesdotorg|GitHub>.\n\n\nWe come from all over the world.  We\'re all different ages; we work & study across all sorts of professions.  Everyone is welcome - no previous experience required!  \n\n\nThis community thrives thanks to the generosity of our members, Slack admin moderators, GitHub code contributors, website community mentors, &amp; monetary donations on <https://opencollective.com/codebuddies|Open Collective.>\n\n.',
          title: '\n:large_blue_diamond:\n\nLet\'s Get Started',
          text: '\n\n:smile:  Don\'t be shy! Introduce yourself in <https://codebuddies.slack.com/archives/C04AQ6GH4|#introduce-yourself> &amp; welcome fellow new members. _The more we know about each other, the better we can connect &amp; collaborate._\n\n\n:point_left::skin-tone-5:  Browse all our public Slack channels by clicking on `CHANNELS` over in the sidebar.\n\n\n:eyeglasses:  Make sure to read our <https://codebuddies.slack.com/files/U0G92F4J0/F8VRAGD0S/CodeBuddies_Slack_Etiquette_for_General_Members|Slack Etiquette for General Members>.\n\n\n:computer:  Log into our <http://codebuddies.org|website> using your new CodeBuddies Slack account &amp; take a look around -- or join a hangout.\n\n\n:calendar: Try scheduling a hangout yourself! (_You don\’t need to be an expert to collaborate._) Simply click on the `Schedule a Hangout` button on the website &amp; fill in the information. All hangouts get automatically posted back to <https://codebuddies.slack.com/archives/C04AQ6GH0|#announcements>.\n\n\n:books:  Interested in going deep on topics like * Functional JS* or that special *Ruby* book or *Blockchain*? Start a <codebuddies.org/study-groups|StudyGroup>!  All study groups created on the website also get automatically posted back to <https://codebuddies.slack.com/archives/C04AQ6GH0|#announcements>.  Invite folks here on Slack to join in so that you can motivate each other to master your learning goal.\n\n\n:question:  If you have any questions about the community or the project or want to talk to an admin, feel free to ask about it in <https://codebuddies.slack.com/archives/C04BRN86J|#codebuddies-meta>. It\'s where discussions related to our community happen.\n\n\n_Happy Learning!_ :wave::skin-tone-5:',
          color: '#74c8ed',
        },
        {
          title: '\n:star:\n\nSome Ground Rules',
          text: 'Our goal is to maintain a safe, helpful &amp; friendly community for everyone, regardless of experience, gender identity &amp; expression, sexual identity &amp; orientation, disability, personal appearance, body size, race, ethnicity, age, religion, nationality, profession, or any other defining characteristic. \n\n\nPlease take the time to *read through the complete <https://github.com/codebuddiesdotorg/codebuddies/blob/master/CODE_OF_CONDUCT.md|Code of Conduct> before continuing.',
          callback_id: 'code-of-conduct',
          color: '#3060f0',
        }]),
    };

  module.exports = { welcome };
