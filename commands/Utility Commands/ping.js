const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
        // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction){
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true , ephemeral: true});
        interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms & Websocket heartbeat: ${interaction.client.ws.ping}ms.`);
    },
};