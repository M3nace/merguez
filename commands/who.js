exports.run = (client, message) => {
  message.delete(300000);

  const pls = client.emojis.find(emoji => emoji.find === 'pls');
  let ret = 'voici les artisans déclarés :\n\n';

  const roles = ['Alchimiste', 'Aquafortiste', 'Forgeron armes', 'Forgeron armures', 'Maître queux'];
  roles.forEach((role) => {
    const members = message.guild.roles.find(grole => grole.name === role).members.map(m => m.user.username);

    if (members.length) {
      ret += `${members.length} \`${role.toLowerCase()}\` : ${members.join(', ')}\n`;
    } else {
      ret += `Il n'y a aucun \`${role.toLowerCase()}\` de déclaré ${pls}\n`;
    }
  });

  ret += '\nSi tu n\'es pas présent dans la liste et que tu souhaites y apparaître, je t\'invite à taper la commande `!metier`';

  message.reply(ret);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['who'],
  permLevel: 'User',
};

exports.help = {
  name: 'who',
  category: 'Utilitaire',
  description: 'Affiche les metiers de craft de ceux qui en ont défini un',
  usage: 'who',
};
