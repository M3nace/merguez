exports.run = (client, message, args) => {
  message.channel.fetchMessages()
    .then((messages) => {
      const deleteMessage = messages.filter(msg => !msg.pinned);
      message.channel.bulkDelete(deleteMessage);
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
