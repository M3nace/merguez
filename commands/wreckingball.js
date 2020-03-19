exports.run = async (client, message, args, level) => {
    message.channel.send("", {
        file: "https://cdn.discordapp.com/attachments/506872317490626561/666044005217206312/testt2.png"
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'Server owner'
  };
  
  exports.help = {
    name: 'wreckingball',
    category: 'Fun',
    description: 'Affiche le plus beau du discord',
    usage: 'wreckingball'
  };
