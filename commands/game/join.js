import { SlashCommandBuilder } from "discord.js";
import { GameMaster } from "../../models/gameMaster.js";
import { Player } from '../../models/player.js';

const animeNames = ['Giorno', 'Chizuru', 'Akeno', 'David', 'Saber', 'Kurapika', 'Denji', 'Sukuna', 'Erwin', 'Johan', 'Sanji', 'Spike' ]

export default {

    data: new SlashCommandBuilder()
        
        .setName('join')
        .setDescription("Join a running L's game"),

    async execute(interaction) {
        
        await interaction.deferReply();

        const gameMaster = await GameMaster.findOne();

        if (gameMaster.phase !== 'join')
            return interaction.editReply('You can only join in the Join Phase.');

        const player = await Player.findOne({ playerId: interaction.user.id });

        if (player)
            return interaction.editReply('You have alread joined the game.')

        const index = Math.floor(Math.random() * animeNames.length);
        const [gameName] = animeNames.splice(index, 1);
        
        await Player.create({
            playerId: interaction.user.id,
            playerName: interaction.user.username,
            gameName,
            isAlive: true,
            role: 'none',
            item: 'none',
            canUseItem: true,
        })

        await interaction.editReply("Joined you in L's game.");
    }
}