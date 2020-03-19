const util = require('util');

const welcomeMsg = `
\`\`\` Bienvenue à la Plage ! \`\`\`
Ceci est un serveur Discord communautaire qui a pour but de rassembler quelques streamers pour vous divertir !
Tu es sûrement arrivé grâce à l'un d'entre nous, alors je te propose de découvrir ce serveur !

Le salon #planning te permet de savoir quand retrouver tes streamers favoris.
Viens discuter avec les autres viewers en #ecoutant-le-chant-des-vagues  !

**Tu peux aussi suivre les différents streamers sur leurs chaînes Twitch :**

Caliwen :coconut: - <http://twitch.tv/caliwen>
Le Deuxième Bleu :blue_heart: - <http://twitch.tv/ledeuxiemebleu>
Narwia :palm_tree: - <http://twitch.tv/narwia>

Ils ont chacun des salons cachés sur le serveur. Pour accéder à chaque communauté, tu peux réagir à ce message avec leurs emotes correspondantes.`;

module.exports = (client) => {
    const chanName = 'bienvenue';
    const bienvenueChan = client.channels.find(chan => chan.name === chanName);
    const bvnMsg = '665689181162307606';

    const alp = client.guilds.get('326803063266344960');
    const roleCaliwen = alp.roles.find(r => r.name === 'Caliwen à la plage');
    const roleLDB = alp.roles.find(r => r.name === 'Le Deuxième Bleu');
    const roleNarwia = alp.roles.find(r => r.name === 'Bigorneau');

    bienvenueChan.fetchMessage(bvnMsg)
        .catch((er) => {
            client.logger.log(`Can't find message ${bvnMsg}`);
            bienvenueChan.send(welcomeMsg).then(message => {
                message.react('🥥');
                message.react('💙');
                message.react('🌴');

                client.logger.log(`New msg id is ${message.id}`);
            });
        });

    client.on('raw', packet => {
        // We don't want this to run on unrelated packets
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
        // Grab the channel to check the message from
        const channel = client.channels.get(packet.d.channel_id);
        // There's no need to emit if the message is cached, because the event will fire anyway for that
        // It's bugged
        //if (channel.messages.has(packet.d.message_id)) return;
        // Since we have confirmed the message is not cached, let's fetch it
        channel.fetchMessage(packet.d.message_id).then(message => {
            // Emojis can have identifiers of name:id format, so we have to account for that case as well
            const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
            // This gives us the reaction we need to emit the event properly, in top of the message object
            const reaction = message.reactions.get(emoji);
            // Adds the currently reacting user to the reaction's users collection.
            if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
            // Check which type of event it is before emitting
            if (packet.t === 'MESSAGE_REACTION_ADD') {
                client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
            }
            if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                client.emit('messageReactionRemove', emoji, client.users.get(packet.d.user_id));
            }
        });
    });

    client.on('messageReactionAdd', (r, user) => {
        if (r.emoji.name === '🥥') {
            alp.member(user).addRole(roleCaliwen);
        } else if (r.emoji.name === '💙') {
            alp.member(user).addRole(roleLDB);
        } else if (r.emoji.name === '🌴') {
            alp.member(user).addRole(roleNarwia);
        }
    });

    client.on('messageReactionRemove', (emoji, user) => {
        if (emoji === '🥥') {
            alp.member(user).removeRole(roleCaliwen);
        } else if (emoji === '💙') {
            alp.member(user).removeRole(roleLDB);
        } else if (emoji === '🌴') {
            alp.member(user).removeRole(roleNarwia);
        }
    });
};
