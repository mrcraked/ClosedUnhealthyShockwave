const { SlashCommandBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc_server_info')
    .setDescription('Get info of the Minecraft server')
    .addStringOption(option =>
      option
        .setName('ip')
        .setDescription(' the ip of the minecraft server')),

  async execute(interaction) {
    const ip = interaction.options.getString('ip');

    const response = await fetch(`https://api.mcsrvstat.us/3/${ip}`);
    const data = await response.json();

    const serverInfo = {
      ip: data.ip,
      port: data.port,
      online: data.online,
      version: data.version,
      playersOnline: data.players.online,
      software: data.software

    };
  
    const embed = {
      color: 0x0099ff,
      title:  `${ip} Minecraft Server Info`,
      fields: [
        {
          name: 'Numeric IP',
          value: serverInfo.ip,
        },
        {
          name: 'Port',
          value: serverInfo.port,
        },
        {
          name: 'Online',
          value: serverInfo.online,
        },
        {
          name: 'Server Version',
          value: serverInfo.version,
        },
        {
          name: 'Players Online',
          value: serverInfo.playersOnline,
        },
        {
          name: 'Software',
          value: serverInfo.software,
        },
      ],
    };
    return interaction.reply({
        embeds: [embed],
        ephemeral: false,
    });
  },
};