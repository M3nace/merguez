const TwitchClient = require('twitch').default;
const WebHookListener = require('twitch-webhooks').default;
const Discord = require('discord.js');

module.exports = async (client) => {

    function get_streamer_config(display_name) {
        const config = {
            'Narwia': {
                channel: 'planning-annonces'
            },
            'Caliwen': {
                channel: 'planning-annonces'
            },
            'LeDeuxiemeBleu': {
                channel: 'planning-annonces'
            },
            'M3nace_': {
                channel: 'test-plz-ignore'
            }
        };

        return config[display_name];
    }

    const twitchClient = TwitchClient.withClientCredentials(client.config.twitch_client_id, client.config.twitch_client_secret);
    const listener = await WebHookListener.create(twitchClient, {port: 8090});

    const streamers = {
        'Narwia': '25450814',
        'Le Deuxième Bleu': '196915649',
        'Caliwen': '82996063',
        'M3nace': '103625059'
    };

    for(var streamer in streamers) {
        let userId = streamers[streamer];

        const subscription = await listener.subscribeToStreamChanges(userId, async (stream) => {
            if (stream) {
                const streamer_config = get_streamer_config(stream.userDisplayName);
                const channel = client.channels.find(chan => chan.name === streamer_config.channel);

                client.logger.log(`${stream.thumbnailUrl}`.replace('{width}', '400').replace('{height}', '225'));

                const msg = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(`https://www.twitch.tv/${stream.userDisplayName}`)
                    .setURL(`https://www.twitch.tv/${stream.userDisplayName}`)
                    .setAuthor(`${stream.userDisplayName} a lancé son stream !`)
                    .addField('Joue à', `${stream.title}`, true)
                    .addField('Heure de lancement', `${stream.startDate}`, true)
                    .setImage(`${stream.thumbnailUrl}`.replace('{width}', '400').replace('{height}', '225'));

                channel.send(msg);

                client.logger.log(`${stream.userDisplayName} just went live with title: ${stream.title}`);
            } else {
                // no stream, no display name
                const user = await twitchClient.helix.users.getUserById(userId);
                client.logger.log(`${user.displayName} just went offline`);
            }
        });
    
        client.logger.log(`Subscribed to streamer ${streamer}!`);
    }

    listener.listen();
};

