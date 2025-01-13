const embedInfo = {
  SearchRole: "LM-NOTIF-OPT",
};

module.exports = {
  name: "landnotifrole",
  async execute(interaction, client) {

    let guild = interaction.guild
		let member = guild.members.cache.get(interaction.user.id)

    let role = interaction.guild.roles.cache.find(
      (role) => role.name === embedInfo.SearchRole
    );
    if (role)
    {
      
		  let hasRole = member.roles.cache.some(role => role.name === embedInfo.SearchRole)

      if (hasRole)
      {
        interaction.member.roles.remove(role);
        return interaction.reply({content: `Your role for \"${embedInfo.SearchRole}\" has been removed.`, ephemeral: true})
      }
      else
      {
        interaction.member.roles.add(role);
        return interaction.reply({content: `Your role for \"${embedInfo.SearchRole}\" has been added.`, ephemeral: true})
      }
    }
    else
    {
      return interaction.reply({content: "Couldn't find the role :(", ephemeral: true})
    }
  },
};
