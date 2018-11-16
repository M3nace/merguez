const Cron = require('cron');

module.exports = async client => {
    // Log that the bot is online.
    client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");

    // Make the bot "play the game" which is the help command with default prefix.
    client.user.setActivity(`${client.config.defaultSettings.prefix}help`, {type: "PLAYING"});

    // Clean
    const convert_chan = client.channels.find("name", "tables-de-conversion");

    const msg_to_keep = ["512967657130295316",
                         "512967675258077184",
                         "512967864970641412",
                         "512967888760602624"];

    var job = Cron.job("0 */15 * * * *", function() {
        convert_chan.fetchMessages()
            .then(messages => {
                let deleted_msg = 0;
                messages.forEach(msg => {
                    if (msg_to_keep.indexOf(msg.id) == -1) {
                        msg.delete();
                        ++deleted_msg;
                    }
                });
                client.logger.log(`${messages.size} messages lu, ${deleted_msg} supprime`);
            });
    });

    job.start();
};
