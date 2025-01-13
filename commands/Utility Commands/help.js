const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("node:fs");

const embedInfo = {
  Color: 7100491,
  Title: "Service Assistance",
  Footer: {
    text: "Commerce Service Desk",
    iconURL: "https://i.imgur.com/cfI0qUe.jpg",
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help2")
    .setDescription("Displays bot commands")
    .setDMPermission(true),

  async execute(interaction) {
    var SavedEmbeds = [];

    console.log(fs.Dir.name)

    const commandDir = fs.readdirSync("./commands");

    for (const category of commandDir) {
      const newDir = fs
        .readdirSync(`./commands/${category}`)
        .filter((file) => file.endsWith(".js"));

      SavedEmbeds[category] = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.tag,
          iconURL:
            interaction.user.displayAvatarURL({ dynamic: true }) + "?size=2048",
        })
        .setTitle(category)
        .setTimestamp()
        .setFooter(embedInfo.Footer);

      for (const file of newDir) {
        const command = require(`../${category}/${file}`);
        SavedEmbeds[category].addFields({name: command.data.name, value: command.data.description})
      }
    }

    var formatEmbeds = []

    for (let category in SavedEmbeds){
      formatEmbeds.push(SavedEmbeds[category])
    }

    return interaction.reply({ embeds: formatEmbeds, ephemeral: true });
  },
};
