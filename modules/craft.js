// Store item properties
class Item {
  constructor(name, emoji = 'black_medium_small_square', amount = 1, recipe = {}) {
    this.name = name;
    this.emoji = emoji;
    this.amount = amount;
    this.recipe = recipe;
  }
}

// Printer object
class CraftPrinter {
  constructor(client, recipes) {
    this.client = client;
    this.recipes = recipes;
    this.cleanUp();
  }

  cleanUp() {
    this.total_kit = 0;
    this.total_po = 0;
    this.total_craft_point = 0;
    this.is_subrecipe = false;
  }

  init() {
    this.emojis = {
      po: this.client.emojis.find(emoji => emoji.name === 'po'),
      elinu: this.client.emojis.find(emoji => emoji.name === 'elinutear'),
    };
  }

  isValidItem(item) {
    return this.recipes.find(recipe => recipe.emoji === item);
  }

  get msg() {
    return `${this.prefix}${this.content}${this.sufix}`;
  }

  decompose(itemEmojiStr, amount) {
    const item = this.recipes.find(recipe => recipe.emoji === itemEmojiStr);

    if (item === undefined) return;

    const itemEmoji = this.client.emojis.find(emoji => emoji.name === item.emoji);
    this.prefix = `Vous voulez décomposer ${itemEmoji} **x${amount}**. Vous pouvez faire :\n\n`;
    this.sufix = `\n\nTape \`!craft [nb] [item emoji]\` pour connaître la liste des ressources nécessaires.`;
    this.content = '';

    this.decomposeLoop(item, amount);
    this.cleanUp();
  }

  decomposeLoop(item, amount) {
    const createTo = this.recipes.find(recipe => item.emoji in recipe.recipe);

    if (createTo === null) return;

    const createToEmoji = this.client.emojis.find(emoji => emoji.name === createTo.emoji);

    const nb = Math.floor((amount / createTo.recipe[item.emoji]) * createTo.amount);
    this.content += `${createToEmoji} ${createTo.name} **x ${nb.toLocaleString()}**.\n`;
    this.decomposeLoop(createTo, nb);
  }

  craft(itemEmojiStr, amount) {
    const item = this.recipes.find(recipe => recipe.emoji === itemEmojiStr);

    if (item === undefined) return;

    const itemEmoji = this.client.emojis.find(emoji => emoji.name === item.emoji);
    this.prefix = `Vous voulez crafter ${itemEmoji} ${item.name} **x ${amount}**. Il vous faut : \n\n`;
    this.sufix = '\n\nTape `!who` pour connaître la liste des personnes avec qui être gentil pour crafter ça.';
    this.content = '';

    this.craftLoop(item.recipe, Math.ceil(amount / item.amount));
    this.cleanUp();
  }

  craftLoop(recipe, amount) {
    Object.entries(recipe).forEach((subrecipe) => {
      const subvalue = subrecipe[1];
      const subitem = this.recipes.find(rec => rec.emoji === subrecipe[0]);
      const subemoji = this.client.emojis.find(emoji => emoji.name === subitem.emoji);
      const subitemamount = subvalue * amount;

      this.content += `${subemoji} ${subitem.name} **x ${subitemamount.toLocaleString()}**\n`;

      if (subitem.emoji === 'craftpoints') {
        this.total_craft_point += subitemamount;
        this.emojis.craft = this.client.emojis.find(emoji => emoji.name === 'craftpoints');
      } else if (subitem.emoji === 'refinekit') {
        const po = subitemamount * 1.07;
        this.content += `${this.emojis.po} PO **x ${Number(po).toLocaleString(undefined, { minimumFractionDigits: 2 })}**\n`;
        this.total_kit += subitemamount;
        this.total_po += po;
        this.emojis.kit = this.client.emojis.find(emoji => emoji.name === 'refinekit');
      } else if (Object.keys(subitem.recipe).length) {
        this.content += `\nCe qui implique de craft ${subemoji} ${subitem.name} **x ${subitemamount.toLocaleString()}**. Il vous faut :\n\n`;
        this.is_subrecipe = true;
        this.craftLoop(subitem.recipe, Math.ceil(subitemamount / subitem.amount));
      } else if (this.is_subrecipe) {
        this.content += `
Ce qui fait un total de :

${this.emojis.craft} Points de craft **x ${this.total_craft_point.toLocaleString()}**
${this.emojis.kit} Kit d'artisan **x ${this.total_kit.toLocaleString()}**
${this.emojis.po} PO **x ${Number(this.total_po).toLocaleString(undefined, { minimumFractionDigits: 2 })}**
${this.emojis.elinu} Larme d'Elinu **x ${Math.round(this.total_craft_point / 4000)}**`;
      }
    });
  }
}

const Enmap = require('enmap');
const jsonrecipes = require('./recipes.json').recipes;

module.exports = (client) => {
  // Load recipes in items
  const recipes = new Enmap();

  jsonrecipes.forEach((recipe) => {
    recipes.set(recipe.emoji, new Item(recipe.name, recipe.emoji, recipe.amount, recipe.recipe));
  });

  client.crafting = new CraftPrinter(client, recipes);
};
