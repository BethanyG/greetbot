const generateResourcesMessage = (resources, templates) => {
  let attachments = [];
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
