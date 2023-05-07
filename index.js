// Require the necessary discord.js classes
const { token, prefix } = require('./config.json');

// Create a new client instance
const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Require your command files
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Create a new collection for your commands
client.commands = new Map();

// Load each command file and add it to the collection
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Listen for messages
client.on('messageCreate', message => {
  // Ignore messages that don't start with the prefix
  if (!message.content.startsWith(prefix)) return;

  // Split the command name and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Get the command object from the collection
  const command = client.commands.get(commandName);

  // If the command doesn't exist, ignore the message
  if (!command) return;

  // Execute the command
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command.');
  }
});

// Clear command
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'clear') {
    if (!message.member.permissions.has('MANAGE_MESSAGES'))
      return message.channel.send(
        "Vous n'avez pas la permission d'utiliser cette commande."
      );
    if (!args[0])
      return message.reply(
        'S\'il vous plaît, indiquez le nombre de messages à supprimer.'
      );
    if (isNaN(args[0]))
      return message.reply('Veuillez entrer un nombre valide à supprimer.');
    if (args[0] > 100)
      return message.reply(
        'Vous ne pouvez pas supprimer plus de 100 messages à la fois.'
      );

    await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
      message.channel.bulkDelete(messages);
      message.reply(`Supprimé ${args[0]} messages.`).then(msg => msg.delete({ timeout: 5000 }));
    });
  }
});

// Log in to Discord with your client's token
client.login(process.env.token);
