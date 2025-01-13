const embedInfo = {
  Color: 7100491,
  Title: "New Property Request",
  Footer: { text: "Service Desk BLM", iconURL: "https://i.imgur.com/cfI0qUe.jpg" },
  //ChannelID: "1161035113434456186", /// Development
  ChannelID: "1089647073852403802", /// Production
  LoggedChannelID: "1161035113434456186",
};

const {
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "requestButton",
  async execute(interaction) {
    const modal = new ModalBuilder()
    .setCustomId("activityModal")
    .setTitle("Activity Submission");

    // Create the text input components
    const businessName = new TextInputBuilder()
      .setCustomId("businessName")
      .setLabel("Business")
      .setPlaceholder("Spectra Pipeline Management")
      .setStyle(TextInputStyle.Short);

    const propertyDistrict = new TextInputBuilder()
      .setCustomId("propertyDistrict")
      .setLabel("Property District")
      .setPlaceholder("Redwood, Prominence, Unincorporated Areas & Prominence\nALT: Farms, Hillview, Greendale")
      .setStyle(TextInputStyle.Short);

    const propertyActivity = new TextInputBuilder()
      .setCustomId("propertyActivity")
      .setLabel("Property Activity Evidence")
      .setPlaceholder("[LINK]")
      .setStyle(TextInputStyle.Paragraph);

    const additionalInformation = new TextInputBuilder()
      .setCustomId("additionalInformation")
      .setLabel("Additional Information")
      .setPlaceholder("Default: N/A")
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder().addComponents(businessName);
    const secondActionRow = new ActionRowBuilder().addComponents(propertyDistrict);
    const thirdActionRow = new ActionRowBuilder().addComponents(propertyActivity);
    const fourthActionRow = new ActionRowBuilder().addComponents(additionalInformation);

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
