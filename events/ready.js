const Cron = require('cron');

module.exports = async (client) => {
  // Log that the bot is online.
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, 'ready');

  // Make the bot 'play the game' which is the help command with default prefix.
  client.user.setActivity(`${client.config.defaultSettings.prefix}help`, { type: 'PLAYING' });

  // Init crafting module
  client.crafting.init();

  // Clean
  const cleanableChan = client.channels.filter(chan => chan.name === 'tables-de-conversion' || chan.name === 'recherche-de-groupe');

  const job = Cron.job('0 */15 * * * *', () => {
    cleanableChan.map(chan => chan.fetchMessages().then((messages) => {
      const deleteMessage = messages.filter(msg => !msg.pinned);
      chan.bulkDelete(deleteMessage);
      client.logger.log(`${chan.name}: ${messages.size} messages lu, ${deleteMessage.size} supprime`);
    }));
  });

  job.start();
};
