const { MessageAttachment, EmbedBuilder, Util } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const embedInfo = {
  Color: 7100491,
  Title: "Service Uptime",
  Footer: { text: "Commerce Service Desk", iconURL: "https://i.imgur.com/cfI0qUe.jpg" },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Displays bot commands"),

  async execute(interaction) {
    var uptime = process.uptime();
    var suffix = "seconds";

    if (uptime > 120) {
      // To minutes
      uptime = uptime / 60;
      suffix = "minutes";

      if (uptime > 60) {
        // To hours
        uptime = uptime / 60;
        suffix = "hours";

        if (uptime > 24) {
          // To days
          uptime = uptime / 24;
          suffix = "days";

          if (uptime > 7) {
            // To weeks
            uptime = uptime / 7;
            suffix = "weeks";
            if (uptime < 2) {
              suffix = "week";
            }
          }
        }
      }
    }

    uptime = uptime.toFixed(0);

    const responseEmbed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL:
          interaction.user.displayAvatarURL({ dynamic: true }) + "?size=2048",
      })
      .setTitle(embedInfo.Title)
      .setDescription(`${uptime.toString()} ${suffix}`)
      .setTimestamp()
      .setColor(embedInfo.Color)
      .setFooter(embedInfo.Footer);

    return interaction.reply({ embeds: [responseEmbed], ephemeral: true });
  },
};
