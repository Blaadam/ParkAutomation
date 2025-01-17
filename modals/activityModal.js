const { appscriptUrl } = require("../config.json");
console.log(appscriptUrl)

const embedInfo = {
  Color: 2177563,
  Title: "New Activity Submission",
  Footer: {
    text: "Firestone Park Service",
    iconURL: "https://i.imgur.com/cfI0qUe.jpg",
  },
};

const Settings = {
  LogChannel: {
    "Law Enforcement and Security": "1062630725821677648",
    "Communications and Public Affairs": "1233910169373511741",
    "Ranger Law Enforcement Academy": "1065814915752927243",
    Director: "1003870522431508511",
    "Deputy Director": "1003870522431508511",
  },

  GroupRoles: new Map([
    [1, "Supervisor"],
    [2, "Group A"],
    [3, "Group B"],
    [4, "Group C"],
    [5, "Group D"],
    [6, "Group E"],
  ]),

  DivisonRoles: [
    "Law Enforcement and Security",
    "Communications and Public Affairs",
    "Ranger Law Enforcement Academy",
    "Director",
  ],

  DivisionCommand: {
    "Law Enforcement and Security": "LES Command",
    "Communications and Public Affairs": "CPA Command",
    "Ranger Law Enforcement Academy": "RLEA Command",
    Director: "Director",
    "Deputy Director": "Director",
  },
};

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const statisticsFilePath = path.join(__dirname, "../statistics.json");

////////////////////////////////////////////////

// Slices a name to get the last portion
function SpliceUsername(Username) {
  var Spliced = Username.split(" | ");
  return Spliced[Spliced.length - 1];
}

async function GetGroup(member) {
  let roleName = null;

  Settings.GroupRoles.forEach(async (groupName, id) => {
    const userRole = member.roles.cache.find((role) => role.name === groupName);
    //console.log(groupName, id, userRole);
    if (userRole && roleName === null) {
      roleName = groupName;
    }
  });

  return roleName;
}

async function GetRoleID(member, name) {
  const userRole = member.roles.cache.find((role) => role.name == name);
  return userRole.id;
}

async function GetRoleIDFromGuild(guild, name) {
  const userRole = guild.roles.cache.find((role) => role.name == name);

  return userRole ? userRole.id : undefined;
}

function GetDivison(member) {
  const userRole = member.roles.cache.find((role) =>
    Settings.DivisonRoles.includes(role.name)
  );
  if (!userRole) {
    return null;
  }
  return userRole.name;
}

function padNumber(number) {
  return String(number).padStart(4, "0");
}

function getStatistics() {
  const statistics = JSON.parse(fs.readFileSync(statisticsFilePath, "utf8"));

  return statistics;
}

function IncrementTaskNumber() {
  var TaskNumber = 0;

  const statistics = getStatistics();

  statistics.TaskCounter = statistics.TaskCounter + 1;
  TaskNumber = statistics.TaskCounter;

  fs.writeFileSync(statisticsFilePath, JSON.stringify(statistics));

  return padNumber(TaskNumber.toString());
}

async function updateStats() {
  var newCount = getStatistics().TaskCounter;

  var Response = await axios({
    method: "post",
    url: appscriptUrl,
    params: {
      taskType: "Bot",
      botCount: newCount,
    },
  });
}

async function getSheetsTask() {
  var Response = await axios({
    method: "get",
    url: appscriptUrl,
  });

  var tasks = Response.data; // JSON.parse(Response.data);

  return tasks.totalTasks;
}

////////////////////////////////////////////////

module.exports = {
  name: "activityModal",
  async execute(interaction, client) {
    const date = interaction.fields.getTextInputValue("date");
    const startTime = interaction.fields.getTextInputValue("startTime");
    const endTime = interaction.fields.getTextInputValue("endTime");
    const screenshots = interaction.fields.getTextInputValue("screenshots");

    // If any value is null, instantly return.
    if (!date || !startTime || !endTime || !screenshots) {
      return interaction.reply({
        content: "You did not fill in the fields correctly.",
        ephemeral: true,
      });
    }

    // Grab the last part of the users nickname, usually will be their roblox name.
    const robloxName = SpliceUsername(
      interaction.member.nickname || interaction.member.displayName
    );

    const Group = await GetGroup(interaction.member);
    const Division = await GetDivison(interaction.member);

    if (!Group || !Division) {
      return interaction.reply({
        content: `Could not identify your group or division role. Check your roles!`,
        ephemeral: true,
      });
    }

    const ChannelID = Settings.LogChannel[Division];

    if (ChannelID == null) {
      return interaction.reply({
        content: `Channel ID for ${Group} does not exist.`,
        ephemeral: true,
      });
    }

    var RoleToTag = "";

    //console.log(Group, Division);

    if (Group == "Supervisor") {
      RoleToTag = `<@&${await GetRoleIDFromGuild(
        interaction.guild,
        Settings.DivisionCommand[Division]
      )}>`;
    } else {
      RoleToTag = `<@&${await GetRoleID(interaction.member, Group)}>`;
    }

    await IncrementTaskNumber();

    // Make an embed for content data
    const newEmbed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL:
          interaction.user.displayAvatarURL({ dynamic: true }) + "?size=512",
      })
      .setTitle(embedInfo.Title)
      .setDescription(`TASKPS${await getSheetsTask()}`)
      .addFields(
        { name: "Roblox Name", value: robloxName },
        { name: "Division", value: Division },
        { name: "Group", value: Group },
        { name: "Shift Date", value: date },
        { name: "Shift Start Time", value: startTime },
        { name: "Shift End Time", value: endTime },
        { name: "Shift Evidence", value: screenshots }
      )
      .setTimestamp()
      .setColor(embedInfo.Color)
      .setFooter(embedInfo.Footer);

    // Send the content to the channel
    const channel = await client.channels.fetch(ChannelID);
    channel.send({ embeds: [newEmbed], content: RoleToTag });

    try {
      updateStats();
    } catch (error) {
      console.warn("error: " + error.toString());
    }

    // Client returner
    return interaction.reply({
      content: "Your submission was received successfully!",
      ephemeral: true,
    });
  },
};
