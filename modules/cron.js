const Cron = require('cron');

module.exports = (client) => {
    // Nettoie le channel indiqué tous les jours à 5h du matin
    const chanName = 'annonces-planning';
    const cleanableChan = client.channels.filter(chan => chan.name === chanName);

    const job = Cron.job('0 5 * * *', () => {
        cleanableChan.map(chan => chan.fetchMessages().then((messages) => {
            const deleteMessage = messages.filter(msg => !msg.pinned);
            chan.bulkDelete(deleteMessage);
            client.logger.log(`${chan.name}: ${messages.size} messages lu, ${deleteMessage.size} supprimes`);
        }));
    });

    job.start();
};
