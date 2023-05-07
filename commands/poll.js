module.exports = {
    name: 'poll',
    description: 'Create a poll with a question and multiple choices',
    execute(message, args) {
      // Get the poll question and choices from the command arguments
      const question = args.shift();
      const choices = args;
  
      // Create the poll message
      let pollMessage = `**${question}**\n\n`;
      choices.forEach((choice, index) => {
        pollMessage += `${index + 1}. ${choice}\n`;
      });
  
      // Send the poll message
      message.channel.send(pollMessage).then(sentMessage => {
        // Add reactions to the poll message for each choice
        choices.forEach((choice, index) => {
          sentMessage.react(getEmoji(index + 1));
        });
      });
    },
  };
  
  // Helper function to get a number emoji based on the index (1-9)
  function getEmoji(index) {
    const numberEmojis = [
      '1️⃣',
      '2️⃣',
      '3️⃣',
      '4️⃣',
      '5️⃣',
      '6️⃣',
      '7️⃣',
      '8️⃣',
      '9️⃣',
    ];
    return numberEmojis[index - 1];
  }
  