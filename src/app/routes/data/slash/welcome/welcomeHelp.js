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
                 '* /welcome `[command] @username`: Sends the result of the command (_test, resource, etc._) as a DM to the user specified.',
                 '* /welcome `post`: Sends a test welcome message to #start_here channel.',
                 '* /welcome `post #channel_name`: Sends a test welcome message to specified channel.'
               ].join('\n'),
         color: '#74c8ed',
       }]),
   };


module.exports = { help };
