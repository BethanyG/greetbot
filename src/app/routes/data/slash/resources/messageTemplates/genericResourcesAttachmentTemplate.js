const generateResourcesMessage = (resources, templates) => {
  let attachments = [];
  // resources.forEach(resource => {
  //   const pretext = `${resource['language-icon']}  ${resource['language-desc']}`;
  //   const title = `\n${resource['level']} ${resource['language']}\n\n`;
  //   const text = `${resource['video-link']}  ${resource['video-desc']}\n\n${resource['tutorial-link']}  ${resource['tutorial-desc']}\n\n${resource['book-link']}  ${resource['book-desc']}\n\n${resource['class-link']}  ${resource['class-desc']}\n\n${resource['help_link']}\n\n${resource['more-questions']}\n\n\n${resource['maintainer']}`;
  //   const color = `${resource['sidebar-color']}`;
  //   attachments.push({pretext, title, text, color});
  // });
  for (var template in templates) {
    let tempLang = templates[template]['language'];
    let tempLevel = templates[template]['level'];
    const pretext = `${templates[template]['language-icon']}${templates[template]['level-icon']} *${tempLang} ${tempLevel}*\n${templates[template]['language-blurb']}`;
    const title = `${templates[template]['language-desc']}`;
    let resourceText = [];
    resources.filter(resource => {
      return resource['language'].toLowerCase() === tempLang.toLowerCase() &&
      resource['level'].toLowerCase() === tempLevel.toLowerCase();
    }).forEach(resource => {
      let costText = resource['media-cost-desc'] === "FREE" ? '' : `(PAID) ${resource['media-cost']}`;
      resourceText.push(`${resource['media-icon']} ${resource['media-link']} ${resource['media-desc']} ${costText}`);
    });
    resourceText.push(templates[template]['help_link'], templates[template]['more-questions'], templates[template]['maintainer']);
    const text = resourceText.join("\n\n\n");
    const mrkdwn_in = ["text", "pretext"];
    const color = templates[template]['sidebar-color'];
    attachments.push({pretext, title, text, mrkdwn_in, color});
  }
  return attachments;
};

module.exports = { generateResourcesMessage };
