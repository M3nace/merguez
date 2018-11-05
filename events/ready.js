const Cron = require('cron');

module.exports = async client => {
    // Log that the bot is online.
    client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");

    // Make the bot "play the game" which is the help command with default prefix.
    client.user.setActivity(`${client.config.defaultSettings.prefix}help`, {type: "PLAYING"});

    // Clean
    const convert_chan = client.channels.find("name", "tables-de-conversion");

    var job = Cron.job("0 */15 * * * *", function() {
        convert_chan.fetchMessages()
            .then(messages => {
                let deleted_msg = 0;
                messages.forEach(msg => {
                    if (msg.id != "498278896739811328" && msg.id != "498278925634502678") {
                        msg.delete();
                        ++deleted_msg;
                    }
                });
                client.logger.log(`${messages.size} messages lu, ${deleted_msg} supprime`);
            });
    });

    job.start();
};
