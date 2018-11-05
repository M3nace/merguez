exports.run = (client, message, args, level) => {
    message.delete(300000);

    const fp = client.emojis.find("name", "facepalm");
    const ye = client.emojis.find("name", "badass");
    const ne = client.emojis.find("name", "nope");
    const roles = ["alchimiste", "aquafortiste", "forgeron armes", "forgeron armures"];
    const role = args.join(" ").toLowerCase();

    if (!args.length) {
        message.reply(`Les rôles possible sont : ${roles.join(", ")}\nIl suffit que tu tapes \`!metier [nom du role]\` pour te déclarer.`);
        return;
    }

    if (!(roles.includes(role))) {
        message.reply(`${fp}... je ne connais pas le metier de ${role}, par contre je connais : ${roles.join(", ")}`);
        return;
    }

    const guild_role = message.member.guild.roles.find(rol => rol.name.toLowerCase() === role);

    if (! message.member.roles.find(rol => rol.name.toLowerCase() === role)) {
        message.member.addRole(guild_role.id);
        message.reply(`a maintenant le role de \`${role}\` ${ye}`);
    } else {
        message.member.removeRole(guild_role.id);
        message.reply(`n'a plus le role de \`${role}\` ${ne}`);
    };
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["metier"],
    permLevel: "User"
};

exports.help = {
    name: "metier",
    category: "Utilitaire",
    description: "Assigne ou enleve un role a l'utilisateur. Ces roles sont en lien avec le craft de Tera : Alchimiste, Aquafortiste, Forgeron armes, Forgeron armures.",
    usage: "metier '[role]'"
};
