# CodeBuddies Slack Application

Adapted from https://glitch.com/~slack-terms-of-service-blueprint.

CodeBuddies Slack app that presents an Welcome message when a new user joins the Slack Team.

The user can accept our Code of Conduct using message buttons. If a user has been presented with the Code before & they haven't accepted, a background job can send them a reminder DM after a specific period of time. Eventually you can use the SCIM API to disable the user's account.

Additionally, the same welcome message can be sent as a `/welcome` command.

Other (upcoming) functionality will include a `/resources` command to send resource links to users, & automatic channel welcomes.

## Setup for Running with your Own Slack Team

#### Create a Slack app

1. Create an app at api.slack.com/apps
1. Navigate to the Bot Users page and add a bot user
1. Navigate to the Install App page and install the app
1. Copy the `xoxb-` token after the installation process is complete

#### Run locally
1. Get the code
    * Either clone this repo and run `npm install`, or set it up on Glitch.com
1. Set the following environment variables to `.env` (see `.env.sample`):
    * `SLACK_TOKEN`: Your app's `xoxb-` token (available on the Install App page)
    * `SLACK_VERIFICATION_TOKEN`: Your app's Verification Token (available on the Basic Information page)
    * `PORT`: The port that you want to run the web server on
1. If you're running the app locally:
    1. Start the app (`npm start`)
    1. In another windown, start ngrok on the same port as your webserver (`ngrok http $PORT`)

#### Enable the Events API
1. Go back to the app settings and click on Events Subscriptions
1. Set the Request URL to your ngrok or Glitch URL + /events
1. On the same page, subscribe to the `team_join` team events

#### Enable Interactive Messages

1. In the app settings, click on Interactive Messages
1. Set the Request URL to your ngrok or Glitch URL + /interactive-message
