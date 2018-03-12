const generateResourcesMessage = (resources, templates) => {
  let attachments = [];
  // resources.forEach(resource => {
  //   const pretext = `${resource['language-icon']}  ${resource['language-desc']}`;
  //   const title = `\n${resource['level']} ${resource['language']}\n\n`;
  //   const text = `${resource['video-link']}  ${resource['video-desc']}\n\n${resource['tutorial-link']}  ${resource['tutorial-desc']}\n\n${resource['book-link']}  ${resource['book-desc']}\n\n${resource['class-link']}  ${resource['class-desc']}\n\n${resource['help_link']}\n\n${resource['more-questions']}\n\n\n${resource['maintainer']}`;
  //   const color = `${resource['sidebar-color']}`;
  //   attachments.push({pretext, title, text, color});
  // });
  console.log(`resources is ${JSON.stringify(resources)}`);
  console.log(`templates is ${JSON.stringify(templates)}`);
  for (var template in templates) {
    let tempLang = template['language'];
    let tempLevel = template['level'];
    const pretext = `${template['language-icon']}${template['level-icon']} *${tempLang} ${tempLevel}*\n${template['language-blurb']}`;
    const title = `${template['language-desc']}`;
    let resourceText = [];
    resources.filter(resource => {
      return resource['language'].toLowerCase() === tempLang.toLowerCase() &&
              resource['level'].toLowerCase() === tempLevel.toLowerCase();
    }).forEach(resource => {
      let costText = resource['media-cost-desc'] === "FREE" ? '' : `(PAID) ${resource['media-cost']}`;
      resourceText.push(`${resource['media-icon']} ${resource['media-link']} ${resource['media-desc']} ${costText}`);
    });
    resourceText.push(template['help_link'], template['more-questions'], template['maintainer']);
    const text = resourceText.join("\n\n\n");
    const color = template['sidebar-color'];
    attachments.push({pretext, title, text, color});
  }
  return attachments;
};

module.exports = { generateResourcesMessage };
