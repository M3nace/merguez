exports.run = (client, message, args) => {
  const fp = client.emojis.find(emoji => emoji.name === 'facepalm');
  const ye = client.emojis.find(emoji => emoji.name === 'badass');
  const ne = client.emojis.find(emoji => emoji.name === 'nope');
  const roles = ['alchimiste', 'aquafortiste', 'forgeron armes', 'forgeron armures', 'maître queux'];
  const role = args.join(' ').toLowerCase();

  if (!args.length) {
    message.reply(`Les métiers possible sont : ${roles.join(', ')}\nIl suffit que tu tapes \`!metier [nom du métier]\` pour te déclarer.`);
    return;
  }

  if (!(roles.includes(role))) {
    message.reply(`${fp}... je ne connais pas le métier de ${role}, par contre je connais : ${roles.join(', ')}`);
    return;
  }

  const guildRole = message.member.guild.roles.find(rol => rol.name.toLowerCase() === role);

  if (!message.member.roles.find(rol => rol.name.toLowerCase() === role)) {
    message.member.addRole(guildRole.id);
    message.reply(`a maintenant le métier de \`${role}\` ${ye}`);
  } else {
    message.member.removeRole(guildRole.id);
    message.reply(`n'a plus le métier de \`${role}\` ${ne}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['metier'],
  permLevel: 'User',
};

exports.help = {
  name: 'metier',
  category: 'Utilitaire',
  description: 'Assigne ou enleve un métier a l\'utilisateur. Ces métiers sont en lien avec le craft de Tera : Alchimiste, Aquafortiste, Forgeron armes, Forgeron armures, Maître queux.',
  usage: 'metier [role]',
};
