const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all available commands'),
    async execute(interaction) {
        let str = '';
        const foldersPath = path.join(__dirname, '../../commands'); // Adjust the path to go up one level from the 'Settings' directory
        const commandFolders = fs.readdirSync(foldersPath);
        for (const folder of commandFolders) {
          const commandsPath = path.join(foldersPath, folder);
          const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
          for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file); // Get the full file path
            const command = require(filePath);
            str += `Name: ${command.data.name} | Description: ${command.data.description} \n`;
          }
        }

        return interaction.reply({
        content: str,
        ephemeral: false,
        });
    }
};