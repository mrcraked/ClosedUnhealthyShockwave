const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clans")
    .setDescription("Send a list of up to 40 clans.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the clan to search.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const apiKey = process.env["apicoc"];
    const apiUrl = `https://api.clashofclans.com/v1/clans?name=${name}&limit=45`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const clans = response.data.items;

      // Create a single embed
      const embed = new EmbedBuilder()
        .setTitle(`list of clans`)
        .setDescription(`the list of clans that has ${name} in name`);
      // Loop through each clan and add fields to the embed
      clans.forEach((clan, index) => {

        const locationName = clan.location ? clan.location.name : null;
        embed.addFields({
          name: `${clan.name}` ,
          value: ` Tag: ${clan.tag}, Type: ${clan.type}`,
          inline: true,
        });

        // If we've reached the 25th clan or the last clan, send the embed and start a new one
        if ((index + 1) % 25 === 0 || index + 1 === clans.length) {
          interaction.reply({
            embeds: [embed],
            ephemeral: false,
          });
          // Reset the embed for the next set of clans
          embed.spliceFields(0, embed.fields.length);
        }
      });
    } catch (error) {
      console.error("Error:", error);
      interaction.reply("An error occurred while fetching clan information.");
    }
  },
};
