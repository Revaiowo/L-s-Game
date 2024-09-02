import { SlashCommandBuilder } from "discord.js";
import { Player } from "../../models/player.js";
import { GameMaster } from "../../models/gameMaster.js";



export default {

    data: new SlashCommandBuilder()
        
        .setName('cancel')
        .setDescription("Cancel a running game"),

    async execute(interaction) {
        
        await interaction.deferReply();

        await Player.deleteMany();

        await GameMaster.findOneAndUpdate({}, { $set: { game: false, phase: 'join' }});

        await interaction.editReply(`Game canceled.`);
    }
}