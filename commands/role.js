exports.run = (client, message, args) => {
  const fp = client.emojis.find(emoji => emoji.name === 'facepalm');
  const ye = client.emojis.find(emoji => emoji.name === 'badass');
  const ne = client.emojis.find(emoji => emoji.name === 'nope');
  const roles = ['tank', 'heal', 'dd'];
  const role = args.join(' ').toLowerCase();

  if (!args.length) {
    message.reply(`Les rôles possible sont : ${roles.join(', ')}\nIl suffit que tu tapes \`!role [nom du role]\` pour t'assigner/retirer ce rôle.`);
    return;
  }

  if (!(roles.includes(role))) {
    message.reply(`${fp}... je ne connais pas le role de ${role}, par contre je connais : ${roles.join(', ')}`);
    return;
  }

  const guildRole = message.member.guild.roles.find(rol => rol.name.toLowerCase() === role);

  if (!message.member.roles.find(rol => rol.name.toLowerCase() === role)) {
    message.member.addRole(guildRole.id);
    message.reply(`a maintenant le role de \`${role}\` ${ye}`);
  } else {
    message.member.removeRole(guildRole.id);
    message.reply(`n'a plus le role de \`${role}\` ${ne}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['role'],
  permLevel: 'User',
};

exports.help = {
  name: 'role',
  category: 'Utilitaire',
  description: 'Assigne ou enleve un role a l\'utilisateur. Ces roles sont en lien avec les classes de Tera : Tank, Heal, ou DPS',
  usage: 'role [role]',
};
