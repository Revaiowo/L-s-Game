import { SlashCommandBuilder, EmbedBuilder  } from "discord.js";
import { GameMaster } from "../../models/gameMaster.js";

export default {

    data: new SlashCommandBuilder()
        
        .setName('start')
        .setDescription('Start a new game')

        .addStringOption(option =>
            option
                .setName('anime')
                .setDescription('Name of the anime')
        )
        .setDMPermission(false),

    async execute(interaction) {
        
        await interaction.reply("Starting L's game.....");

        const channelId = interaction.channel.id;
        const channel = await interaction.client.channels.fetch(channelId);
        
        await GameMaster.create({
            game: true,
            channelId,
            phase: 'join',
            LDies: false,
            nearDies: false,
            kiraDies: false,
            gameRound: false,
        });
        
        await channel.send("Join L's Game using the /join command.");
    }
}