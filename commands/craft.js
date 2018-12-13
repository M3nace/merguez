class Item {
    constructor(emoji, name, label, nb, config) {
	this.emoji = emoji;
	this.name = name;
	this.label = label;
        this.nb = nb;
	this.config = config;
    }
}

const craft_points = new Item("craftpoints", null, "Points de craft", 0, null);
const golden_talent = new Item("goldentalent", null, "Cristaux d'or", 0, null);
const ruby = new Item("ruby", null, "Rubis", 0, null);
const refine_kit = new Item("refinekit", null, "Kit de craft", 0, null);
const silver_talent = new Item("silvertalent", null, "Cristaux d'argent", 0, null);

const sapphire = new Item("sapphire", "saphir", "Saphirs", 1, [
    { "item": craft_points, "number": 20 },
    { "item": refine_kit, "number": 20 },
    { "item": ruby, "number": 2 },
]);

const emerald = new Item("emerald", "emeraude", "Emeraudes", 1, [
    { "item": craft_points, "number": 85 },
    { "item": refine_kit, "number": 100 },
    { "item": sapphire, "number": 5 }
]);

const diamond = new Item("diamond", "diamant", "Diamants", 1, [
    { "item": craft_points, "number": 500 },
    { "item": refine_kit, "number": 1000 },
    { "item": emerald, "number": 10 }
]);

const golden_daric = new Item("goldendaric", "pieceor", "Pièces d'or", 3, [
    { "item": craft_points, "number": 20 },
    { "item": refine_kit, "number": 60 },
    { "item": golden_talent, "number": 5 }
]);

const golden_plate = new Item("goldenplate", "lingotor", "Lingots d'or", 3, [
    { "item": craft_points, "number": 80 },
    { "item": refine_kit, "number": 240 },
    { "item": golden_daric, "number": 5 }
]);

const silver_siglo = new Item("silversiglo", "pieceargent", "Pièces d'argent", 3, [
    { "item": craft_points, "number": 20 },
    { "item": refine_kit, "number": 60 },
    { "item": silver_talent, "number": 5 }
]);

const silver_plate = new Item("silverplate", "lingotargent", "Lingots d'argent", 3, [
    { "item": craft_points, "number": 80 },
    { "item": refine_kit, "number": 240 },
    { "item": silver_siglo, "number": 5 }
]);

const recipes = [silver_siglo, silver_plate, golden_daric, golden_plate, sapphire, emerald, diamond];

let need = "";
let tot_craft = 0;
let tot_kit = 0;
let loop = 0;
function print_craft(client, nbitem, crafthis, iej) {
    let lop, nb;

    let poemoji = client.emojis.find("name", "po");

    crafthis.config.forEach(i => {
	lop = i.item;
	const pem = client.emojis.find("name", lop.emoji);
	nb = i.number * nbitem;
	need += `${pem} ${lop.label} **x${nb}**\n`;

	if (lop.emoji == "craftpoints") { tot_craft += nb; }
	if (lop.emoji == "refinekit") {
            need += `${poemoji} PO **x${Number(nb * 1.07).toFixed(2)}**\n`;
            tot_kit += nb;
        }
    });

    if (lop.config !== null) {
	++loop;
	iej = client.emojis.find("name", lop.emoji);
	need += `\nCe qui implique de craft ${iej} ${lop.label} **x${nb}**. Il vous faut :\n\n`;
	print_craft(client, nb / lop.nb, lop, iej);
    } else if (tot_craft && tot_kit && loop >= 1) {
	need += `\n\nCe qui fait un total de :\n\n`;

	let craftemoji = client.emojis.find("name", craft_points.emoji);
	let kitemoji = client.emojis.find("name", refine_kit.emoji);
	let elinumoji = client.emojis.find("name", "elinutear");

	need += `${craftemoji} ${craft_points.label} **x${tot_craft}**\n`;
	need += `${kitemoji} ${refine_kit.label} **x${tot_kit}**\n`;
        need += `${poemoji} PO **x${Number(tot_kit * 1.07).toFixed(2)}**\n`;
	need += `${elinumoji} Larmes Elinu **x${Math.round(tot_craft / 4000)}**\n`;
    }
}

exports.run = async(client, message, nbitem, level) => {
    message.delete(300000);

    const fp = client.emojis.find("name", "facepalm");

    if (!nbitem.length) {
	message.reply(`Je ne sais pas quelle quantité tu veux crafter ${fp} - Tape \`!craft [nombre]\``);
        return;
    }

    if (isNaN(parseInt(nbitem)) || nbitem.length != 1) {
	message.reply(`Je ne demande qu'un entier, UN SEUL ENTIER, bordel ${fp}`);
	return;
    }

    let botrep;
    message.reply(`Que veux-tu crafter ${nbitem} fois ? Clique sur l'icône de ce que tu veux crafter.`)
        .then(async rep => {
            // Ugly as fuck, change to an async loop
            botrep = rep;
            await rep.react(client.emojis.find("name", "sapphire"));
            await rep.react(client.emojis.find("name", "emerald"));
            await rep.react(client.emojis.find("name", "diamond"));
            await rep.react(client.emojis.find("name", "goldendaric"));
            await rep.react(client.emojis.find("name", "goldenplate"));
            await rep.react(client.emojis.find("name", "silversiglo"));
            await rep.react(client.emojis.find("name", "silverplate"));
        });

    client.on('messageReactionAdd', function printReact(reaction, user) {
        if (user.bot) return;

        let crafthis = recipes.find(function(recipe) {
	    return recipe.emoji == reaction.emoji.name;
        });

        if (crafthis !== undefined) {
            botrep.delete();
            const iej = client.emojis.find("name", crafthis.emoji);

            need += `Vous voulez crafter ${iej} ${crafthis.label} **x${nbitem}**. Il vous faut :\n\n`;

            print_craft(client, nbitem / crafthis.nb, crafthis, iej);

            need += "\nTape `!who` pour connaître la liste des personnes avec qui être gentil pour crafter ça";

            message.channel.send(need).then(msg => { msg.delete(300000); });
            need = "";
            tot_craft = 0;
            tot_kit = 0;
            loop = 0;
        }

        client.removeListener('messageReactionAdd', printReact);
        return;
    });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["craft"],
    permLevel: "User"
};

exports.help = {
    name: "craft",
    category: "Utilitaire",
    description: "Donne les ressources necessaire pour crafter un item",
    usage: `craft <nombre>`
};
