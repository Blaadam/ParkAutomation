const embedInfo = {
    Color: 7100491,
    Title: "Notice of Obtainable Roles",
    Footer: { text: "Service Management Center", iconURL: "https://i.imgur.com/cfI0qUe.jpg" },
    //ChannelID: "1161035113434456186", /// Development
    ChannelID: "735894843259355288", /// Production
};

////////////////////////////////////////////////

const {
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

////////////////////////////////////////////////

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clickies")
        .setDescription("Creates a clicky message")

        .addChannelOption(options =>
            options.setName("sendingchannel")
                .setDescription("Channel to send clickies to")
                .setRequired(true)),

    //.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction, client) {
        const submissionDeadline = interaction.options.getChannel("sendingchannel");

        if (interaction.user.id != "251442524516909058") {
            return interaction.reply("Nuh uh")
        }

        const newEmbed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.tag,
                iconURL:
                    interaction.user.displayAvatarURL({ dynamic: true }) + "?size=512",
            })
            .setTitle(embedInfo.Title)
            .setDescription(
                "Dear Esteemed Users," +
                "\n\n" +
                "We are excited to introduce three new roles in our Discord server: \"LM-NOTIF-OPT,\" \"OPA-NOTIF-OPT,\" and \"IO-NOTIF-OPT\". " +
                "\n\n" +
                "1. <@&1164856752181870642>: Stay informed about Land Management updates and discussions.\n" +
                "2. <@&1165634179497738292>: Be the first to know about new developments in the Office of Public Affairs\n" +
                "3. <@&1165634260649115749>: Receive updates on our Inspections Office initiatives." +
                "\n\n" +
                "To opt in, simple click on the corrosponding button in attached below the message. If you have any queries, our support team is ready to assist." +
                "\n\n" +
                "Enjoy exploring these new roles!" +
                "\n\n" +
                "Best Regards,\n" +
                "Firestone Department of Commerce: Discord Server Team"

            )
            .setTimestamp()
            .setColor(embedInfo.Color)
            .setFooter(embedInfo.Footer);

        // Create a link button
        const landnotifrole = new ButtonBuilder()
            .setCustomId('landnotifrole')
            .setLabel('Obtain the LM-NOTIF-OPT role')
            .setStyle(ButtonStyle.Success);

        const publnotifrole = new ButtonBuilder()
            .setCustomId('publnotifrole')
            .setLabel('Obtain the OPA-NOTIF-OPT role')
            .setStyle(ButtonStyle.Success);

        const inspnotifrole = new ButtonBuilder()
            .setCustomId('inspnotifrole')
            .setLabel('Obtain the IO-NOTIF-OPT role')
            .setStyle(ButtonStyle.Success);

        // Create an action row to store the button
        const row = new ActionRowBuilder().addComponents(landnotifrole, publnotifrole, inspnotifrole);

        // Send the content to the channel
        const channel = await client.channels.fetch(embedInfo.ChannelID);
        channel.send({ embeds: [newEmbed], components: [row] });

        // Client returner
        return interaction.reply({
            content: "Sent Message",
            ephemeral: true,
        });

    },
};
