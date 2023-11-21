const { SlashCommandBuilder } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mc_server_info")
    .setDescription("Retrieve information about a Minecraft server.")
    .addStringOption((option) =>
      option
        .setName("ip")
        .setDescription("The IP address of the Minecraft server.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const ip = interaction.options.getString("ip");

    const response = await fetch(`https://api.mcsrvstat.us/3/${ip}`);
    const data = await response.json();

    let players = "";
    if (!data.online) {
      players += "No players online";
    } else {
      players += data.players.online;
    }

    const serverInfo = {
      hostname: data.hostname,
      ip: data.ip,
      port: data.port,
      online: data.online,
      version: data.version || "Null, Server Offline or not exist",
      playersOnline: players,
      software: data.software || "Null, Server Offline or not exist",
    };

    var status = "";
    if (serverInfo.online == true) {
      status = "online";
    } else {
      status = "offline";
    }

    const embed = {
      color: 0x0099ff,
      title: `${ip} Info`,
      fields: [
        {
          name: "Hostname",
          value: serverInfo.hostname,
        },
        {
          name: "Numeric IP",
          value: serverInfo.ip,
        },
        {
          name: "Port",
          value: serverInfo.port,
        },
        {
          name: "Status",
          value: status,
        },
        {
          name: "Server Version",
          value: serverInfo.version,
        },
        {
          name: "Players Online",
          value: serverInfo.playersOnline,
        },
        {
          name: "Software",
          value: serverInfo.software,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "MC Server Info",
      },
      thumbnail: {
        url: `https://api.mcsrvstat.us/icon/${ip}`,
      },
    };

    return interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};
