require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const onboard = require('./onboard');

const app = express();

/*
 * parse application/x-www-form-urlencoded && application/json
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<h2>The Welcome/Code of Conduct app is running</h2> <p>Follow the' +
  ' instructions in the README to configure this Slack App and your' +
  ' environment variables.</p>');
});

/*
 * Endpoint to receive events from Slack's Events API.
 * Handles:
 *   - url_verification: Returns challenge token sent when present.
 *   - event_callback: Confirm verification token & handle `team_join` event.
 */
app.post('/events', (req, res) => {
  switch (req.body.type) {
    case 'url_verification': {
      // verify Events API endpoint by returning challenge if present
      res.send({ challenge: req.body.challenge });
      break;
    }
    case 'event_callback': {
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        const event = req.body.event;

        // `team_join` is fired whenever a new user (incl. a bot) joins the team
        // check if `event.is_restricted == true` to limit to guest accounts
        if (event.type === 'team_join' || && !event.is_bot) {
          const { team_id, id } = event.user;
          onboard.initialMessage(team_id, id);
        }
        res.sendStatus(200);
      } else { res.sendStatus(500); }
      break;
    }
    default: { res.sendStatus(500); }
  }
});

/*
 * Endpoint to receive slash commands from Slack's API.
 * Handles:
 *   -`welcome` is fired whenever a user evokes the "slash welcome" command.
 *   - this function attempts to confirm verification token & then execute various welcome `slash commmand` scenarios.
 *   - command extentions can be added via case statements.
 */
app.post('/welcome', (req, res) => {
  console.log("Received slash command " + req.body.command + " from " + req.body.user_id + " with " + req.body.text);

  const textPayload = req.body.text;
  const target_user = textPayload.substring(textPayload.lastIndexOf("@")+1, textPayload.lastIndexOf("|"));
  const actionRequest = target_user ? textPayload.substring(textPayload.indexOf(''),textPayload.lastIndexOf("<")-1) : req.body.text;
  const user_id = req.body.user_id;

  console.log("USER ID :: " + user_id);
  console.log("TARGET USER :: " + target_user);
  console.log("ACTION :: " + actionRequest);
  console.log("MESSAGE BODY :: " + textPayload);

  switch (actionRequest) {
    case 'test': {
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        const team_id = req.body.team_id;
        const slashWelcome = true;

        if (!target_user){
          onboard.testMessage(team_id, user_id, slashWelcome);
          res.sendStatus(200);
        }else{
          onboard.testMessage(team_id, target_user, slashWelcome);
          res.sendStatus(200);
        }
      }else{ res.sendStatus(500);};
      break;
    }
    case 'FOO': {
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        //const command = req.body.text;
        const team_id = req.body.team_id;
        const slashWelcome = true

        if (!target_user){
          onboard.fooMessage(team_id, user_id, slashWelcome);
          res.sendStatus(200);
        }else {
          onboard.fooMessage(team_id, target_user, slashWelcome);
          res.sendStatus(200);
        }
      } else { res.sendStatus(500); }
      break;
    }
    case 'python': {
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        //const command = req.body.text;
        const team_id = req.body.team_id;
        const slashWelcome = true

        if (!target_user){
          onboard.pythonMessage(team_id, user_id, slashWelcome);
          res.sendStatus(200);
        }else {
          onboard.pythonMessage(team_id, target_user, slashWelcome);
          res.sendStatus(200);
        }
      } else { res.sendStatus(500); }
      break;
    }
    default: { res.sendStatus(503); }
  }
});

/*
 * Endpoint to receive events from interactive welcome message on Slack. Checks the
 * verification token before continuing.
 */
app.post('/interactive-message', (req, res) => {
  const { token, user, team } = JSON.parse(req.body.payload);
  if (token === process.env.SLACK_VERIFICATION_TOKEN) {
    // simplest case with only a single button in the application
    // check `callback_id` and `value` if handling multiple buttons
    onboard.accept(user.id, team.id);
    res.send({ text: '_*Thank you!*_\n\n\nWe\'ll put this here so you don\'t forget:\n\n\n:smile:  Don\'t be shy! Introduce yourself in <https://codebuddies.slack.com/archives/C04AQ6GH4|#introduce-yourself> &amp; welcome fellow new members. _The more we know about each other, the better we can connect &amp; collaborate._\n\n\n:point_left::skin-tone-5:  Browse all our public Slack channels by clicking on `CHANNELS` over in the sidebar.\n\n\n:eyeglasses:  Make sure to read our <https://codebuddies.slack.com/files/U0G92F4J0/F8VRAGD0S/CodeBuddies_Slack_Etiquette_for_General_Members|Slack Etiquette for General Members>.\n\n\n:computer:  Log into our <http://codebuddies.org|website> using your new CodeBuddies Slack account &amp; take a look around -- or join a hangout.\n\n\n:calendar: Try scheduling a hangout yourself! (_You don\’t need to be an expert to collaborate._) Simply click on the `Schedule a Hangout` button on the website &amp; fill in the information. All hangouts get automatically posted back to <https://codebuddies.slack.com/archives/C04AQ6GH0|#announcements>.\n\n\n:books:  Interested in going deep on topics like * Functional JS* or that special *Ruby* book or *Blockchain*? Start a <codebuddies.org/study-groups|StudyGroup>!  All study groups created on the website also get automatically posted back to <https://codebuddies.slack.com/archives/C04AQ6GH0|#announcements>.  Invite folks here on Slack to join in so that you can motivate each other to master your learning goal.\n\n\n:question:  If you have any questions about the community or the project or want to talk to an admin, feel free to ask about it in <https://codebuddies.slack.com/archives/C04BRN86J|#codebuddies-meta>. It\'s where discussions related to our community happen.\n\n\n*Some Quick Links:*\n\n<http://codebuddies.org|CodeBuddies Website>\n<http://codebuddies.org/faq|CodeBuddies FAQ>\n<https://github.com/codebuddiesdotorg/codebuddies|CodeBuddies on GitHub>\n<https://www.facebook.com/groups/TOPSTUDYGROUP/|CodeBuddies on Facebook>\n<http://twitter.com/codebuddiesmeet|CodeBuddies on Twitter>\n\n\n_Happy Learning!_ :wave::skin-tone-5:'
    });
  } else { res.sendStatus(500); }
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});
