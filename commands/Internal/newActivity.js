const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("activityreport")
    .setDescription("Activity Submission"),

  async execute(interaction) {
    //interaction.deferReply({ ephemeral: true })

    const modal = new ModalBuilder()
      .setCustomId("activityModal")
      .setTitle("Activity Submission");

    // Add components to modal

    // Create the text input components
    const date = new TextInputBuilder()
      .setCustomId("date")
      .setLabel("Shift Date")
      .setPlaceholder("2024-04-27")
      .setStyle(TextInputStyle.Short);

    const startTime = new TextInputBuilder()
      .setCustomId("startTime")
      .setLabel("Shift Start Time")
      .setPlaceholder("11:26pm BST")
      .setStyle(TextInputStyle.Short);

    const endTime = new TextInputBuilder()
      .setCustomId("endTime")
      .setLabel("Shift End Time")
      .setPlaceholder("12:26am BST")
      .setStyle(TextInputStyle.Paragraph);

    const screenshots = new TextInputBuilder()
      .setCustomId("screenshots")
      .setLabel("Shift Screenshots")
      .setPlaceholder("[LINK]")
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder().addComponents(date);
    const secondActionRow = new ActionRowBuilder().addComponents(startTime);
    const thirdActionRow = new ActionRowBuilder().addComponents(endTime);
    const fourthActionRow = new ActionRowBuilder().addComponents(screenshots);

    // Add inputs to the modal
    modal.addComponents(
      firstActionRow,
      secondActionRow,
      thirdActionRow,
      fourthActionRow
    );

    return await interaction.showModal(modal);
  },
};
