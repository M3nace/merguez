exports.run = (client, message, args) => {
  message.channel.fetchMessages()
    .then((messages) => {
      message.channel.bulkDelete(messages);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['clean'],
  permLevel: 'Maitre nageur',
};

exports.help = {
  name: 'clean',
  category: 'Utilitaire',
  description: 'Supprime tous les message d\'un salon textuel.',
  usage: 'clean',
};
