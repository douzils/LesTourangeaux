const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear messages in the current channel')
    .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to clear').setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    if (amount < 1 || amount > 100) {
      return await interaction.reply('You can only delete between 1 and 100 messages at once.');
    }

    const message = await interaction.reply(`Are you sure you want to delete ${amount} messages?`);

    const filter = i => {
      return i.user.id === interaction.user.id && (i.content.toLowerCase() === 'yes' || i.content.toLowerCase() === 'no');
    };

    const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.content.toLowerCase() === 'yes') {
        await interaction.channel.bulkDelete(amount + 1);
        await interaction.reply(`Successfully deleted ${amount} messages.`);
      } else {
        await interaction.reply('Cancelled.');
      }
    });

    collector.on('end', async collected => {
      if (collected.size === 0) {
        await interaction.reply('You did not respond in time.');
      }
    });
  },
};
