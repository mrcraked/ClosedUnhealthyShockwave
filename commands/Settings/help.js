const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all available commands'),
    async execute(interaction) {
        let str
        const foldersPath = path.join(__dirname, 'commands');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
          // Grab all the command files from the commands directory you created earlier
          const commandsPath = path.join(foldersPath, folder);
          const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
          // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
          for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(`./${file}`);
            str += `Name: ${command.data.name}, Description: ${command.data.description} \n`;
            } 
          }
      
        return interaction.reply({
        content: str,
        ephemeral: true,
        });
    }
};