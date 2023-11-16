const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the Latency of the bot"),
  async execute(interaction) {
    await interaction.deferReply();
    const reply = await interaction.editReply("Ping?");
    await interaction.editReply(
      `Pong! Latency is ${
        reply.createdTimestamp - interaction.createdTimestamp
      }ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms.`
    );
  },
};
