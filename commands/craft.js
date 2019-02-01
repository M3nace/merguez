exports.run = async (client, message, [nbitem, item]) => {
  // Checks
  const fp = client.emojis.find(emoji => emoji.name === 'facepalm');

  if ((nbitem === undefined || item === undefined) || (!nbitem.length && !item.length)) {
    message.reply(`Je ne sais pas ce que tu veux crafter ni en quelle quantité ${fp} - Tape \`!craft [nombre] [item emoji]\``);
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

  client.crafting.craft(itemName, nbitem);
  message.channel.send(client.crafting.msg);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['craft'],
  permLevel: 'User',
};

exports.help = {
  name: 'craft',
  category: 'Utilitaire',
  description: 'Donne les ressources necessaire pour crafter un item',
  usage: 'craft <nombre> <item emoji>',
};
