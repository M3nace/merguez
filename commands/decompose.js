exports.run = async (client, message, [nbitem, item]) => {
  // Checks
  const fp = client.emojis.find(emoji => emoji.name === 'facepalm');

  if ((nbitem === undefined || item === undefined) || (!nbitem.length && !item.length)) {
    message.reply(`Je ne sais pas ce que tu veux décomposer ni en quelle quantité ${fp} - Tape \`!decompose [nombre] [item emoji]\``);
    return;
  }

  if (Number.isNaN(parseInt(nbitem, 10))) {
    message.reply(`Je ne demande qu'un entier, UN SEUL ENTIER, bordel ${fp}`);
    return;
  }

  const itemName = item.match(/:(\w+):/)[1];

  if (!client.crafting.isValidItem(itemName)) {
    message.reply(`Je ne sais pas ce qu'est un ${item} ${fp}`);
    return;
  }

  client.crafting.decompose(itemName, nbitem);
  message.channel.send(client.crafting.msg);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['decompose'],
  permLevel: 'User',
};

exports.help = {
  name: 'decompose',
  category: 'Utilitaire',
  description: 'Donne les items qu\'il est possible de crafter avec un certain type de ressource.',
  usage: 'decompose <nombre> <item emoji>',
};
