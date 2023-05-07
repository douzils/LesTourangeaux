module.exports = {
    name: 'help',
    description: 'Affiche la liste des commandes disponibles.',
    execute(message, args) {
      // liste de toutes les commandes disponibles
      const commandsList = [
        '!clear',
        '!ping',
        '!poll',
        // ajouter toutes les commandes disponibles ici
      ];
  
      // construire le message avec la liste des commandes disponibles
      const helpMessage = `Les commandes disponibles sont :\n\n${commandsList.join('\n')}`;
  
      // envoyer le message dans le canal où la commande a été appelée
      message.channel.send(helpMessage);
    },
  };
  