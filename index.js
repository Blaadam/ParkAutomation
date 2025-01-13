// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  ActivityType,
  Status,
} = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const mainDir = fs.readdirSync("./commands");

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

const commands = [];

for (const folder of mainDir) {
  const newDir = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of newDir) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }
}

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  client.user.setActivity("over Environmental Crimes", {
    type: ActivityType.Watching,
  });
  client.user.setStatus("dnd");
  require("./AntiCrash.js")(client);
});

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();

client.login(token);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    await command.execute(interaction, client);
  } else if (interaction.isModalSubmit()) {
    const modal = require(`./modals/${interaction.customId}`);
    if (modal) {
      await modal.execute(interaction, client);
    }
  } else if (interaction.isButton()) {
    const button = require(`./buttons/${interaction.customId}`);
    if (button) {
      await button.execute(interaction, client);
    }
  }
});
