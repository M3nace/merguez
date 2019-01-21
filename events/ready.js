const Cron = require('cron');

module.exports = async (client) => {
  // Log that the bot is online.
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, 'ready');

  // Make the bot 'play the game' which is the help command with default prefix.
  client.user.setActivity(`${client.config.defaultSettings.prefix}help`, { type: 'PLAYING' });

  // Init crafting module
  client.crafting.init();

  // Clean
  const convertChan = client.channels.find(chan => chan.name === 'tables-de-conversion');

  const msgToKeep = ['512967657130295316', '512967675258077184', '512967864970641412', '512967888760602624'];

  const job = Cron.job('0 */15 * * * *', () => {
    convertChan.fetchMessages()
      .then((messages) => {
        let deletedMsg = 0;
        messages.forEach((msg) => {
          if (msgToKeep.indexOf(msg.id) === -1) {
            msg.delete();
            deletedMsg += 1;
          }
        });
        client.logger.log(`${messages.size} messages lu, ${deletedMsg} supprime`);
      });
  });

  job.start();
};
