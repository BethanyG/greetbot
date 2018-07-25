# greetbot
greetbot is a Slack app built with [ExpressJS](https://expressjs.com/) to be used with the [Codebuddies](https://www.codebuddies.org) open Slack community. greetbot helps us welcome and onboard new members and provide valuable coding resources.

________________________________________________________________________________

## Please contribute to this repository through CodeBuddies (https://github.com/codebuddies):
1. Ask for an invite to our test Slack team & to our Glitch.com project account if you'd like to test/work in our staging environment.
2. Clone the repo (specifically the **development** branch)
2. Make a branch off **development** for your changes.
3. Push your branch back to Github.
4. Pull that branch to Glitch.com for viewing with our Test Slack team.
5. As an alternative, use **NGROK (https://ngrok.com/)** with your own Slack Team for development. (see the directions below, in addition to https://api.slack.com/slack-apps for how to set up and install a custom slack app for your team account).
5. Make your changes & then save/push those changes back to Github on your branch.
6. Open a pull request to merge your proposed changes back into **devlopment**.  Please note any feature or bug numbers addressed & any other important notes in your pull request comments.

________________________________________________________________________________

## Contributing
### Code of Conduct
This is an open source project and we welcome all developers of all skill levels. We encourage all contributors to create Issues, submit Pull Requests, and review each other's code. As such, we expect people to be open for discussion and feedback. If you want to provide feedback or comment, please make sure that your comments are constructive.

**TL;DR:** Be nice, we are all here to learn together.

### Development
Development contribution requires that you have your own Slack workspace as your sandbox for local development purposes. For instructions on how to make your own, see Slack's [tutorial](https://get.slack.help/hc/en-us/articles/206845317-Create-a-Slack-workspace).

#### Getting Started
1. Install dependencies with NPM
```bash
  npm install
```

2. Create an `.env` file by following the same structure as `.env.example`. Change the `DEV_SUBDOMAIN` variable to your name without spaces. For example, if your name is Jane Fonda, then the `DEV_SUBDOMAIN` value should be `janefonda`.

3. Run Development mode
```bash
  npm run start:dev
```

#### Installing greetbot in your sandbox workspace
We have created a guide on how to set up your local version of greetbot in your Slack workspace. Read it [here](https://github.com/codebuddies/greetbot/wiki/Setup-Greetbot-in-your-Slack-Workspace).

#### Putting it all together :tada: 
Now that you have followed the tutorials and guides linked above to a T (right??), greetbot should work in your slack workspace. Try sending a slash command by typing `/welcome test`. greetbot should send you private message with a welcome message.

### Feature Requests / Ideas / Issues
For bugs or other issues, feel free to file an [Issue](https://github.com/codebuddies/greetbot/issues).

For ideas, join us for a discussion at the Codebuddies Slack channel, `#cb-code`. You can get an invite to Codebuddies [here](https://codebuddiesmeet.herokuapp.com/).

## License
MIT Licensed, see [LICENSE](https://github.com/codebuddies/greetbot/blob/master/LICENSE) for details.
