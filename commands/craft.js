exports.run = async (client, message, nbitem) => {
  // Auto delete message
  message.delete(300000);

  // Checks
  const fp = client.emojis.find(emoji => emoji.name === 'facepalm');

  if (!nbitem.length) {
    message.reply(`Je ne sais pas quelle quantité tu veux crafter ${fp} - Tape \`!craft [nombre]\``);
    return;
  }

  if (Number.isNaN(parseInt(nbitem, 10)) || nbitem.length !== 1) {
    message.reply(`Je ne demande qu'un entier, UN SEUL ENTIER, bordel ${fp}`);
    return;
  }

  let botrep;
  message.reply(`Que veux-tu crafter ${nbitem} fois ? Clique sur l'icône de ce que tu veux crafter.`)
    .then(async (rep) => {
      // Ugly as fuck, change to an async loop
      botrep = rep;
      await rep.react(client.emojis.find(emoji => emoji.name === 'sapphire'));
      await rep.react(client.emojis.find(emoji => emoji.name === 'emerald'));
      await rep.react(client.emojis.find(emoji => emoji.name === 'diamond'));
      await rep.react(client.emojis.find(emoji => emoji.name === 'goldendaric'));
      await rep.react(client.emojis.find(emoji => emoji.name === 'goldenplate'));
      await rep.react(client.emojis.find(emoji => emoji.name === 'silversiglo'));
      await rep.react(client.emojis.find(emoji => emoji.name === 'silverplate'));

      return rep;
    })
    .then((rep) => {
      const filter = (reaction, user) => user.id === message.author.id && !user.bot;
      const collector = rep.createReactionCollector(filter, { time: 15000, max: 1 });
      collector.on('collect', (reaction) => {
        client.crafting.craft(reaction.emoji.name, nbitem);
        botrep.delete();
        message.channel.send(client.crafting.msg).then((msg) => { msg.delete(300000); });
      });
    });
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
  usage: 'craft <nombre>',
};
