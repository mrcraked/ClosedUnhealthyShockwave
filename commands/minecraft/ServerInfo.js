const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const path = require("node:path");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mc_server_info")
    .setDescription("Get info of the Minecraft server")
    .addStringOption((option) =>
      option.setName("ip").setDescription(" the ip of the minecraft server")
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
      title: `${ip} Mc Server Info`,
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
    };

    return interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};
