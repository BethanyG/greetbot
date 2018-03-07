const generateResourcesMessage = (resources) => {
  let attachments = [];
  resources.forEach(resource => {
    const pretext = `${resource['language-icon']}  ${resource['language-desc']}`;
    const title = `\n${resource['level']} ${resource['language']}\n\n`;
    const text = `${resource['video-link']}  ${resource['video-desc']}\n\n${resource['tutorial-link']}  ${resource['tutorial-desc']}\n\n${resource['book-link']}  ${resource['book-desc']}\n\n${resource['class-link']}  ${resource['class-desc']}\n\n${resource['help_link']}\n\n${resource['more-questions']}\n\n\n${resource['maintainer']}`;
    const color = `${resource['sidebar-color']}`;
    attachments.push({pretext, title, text, color});
  });
  return attachments;
};

module.exports = { generateResourcesMessage };
