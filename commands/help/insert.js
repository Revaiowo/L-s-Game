import { SlashCommandBuilder } from "discord.js";
import { Player } from "../../models/player.js";

const ids = ['468392588790071296', '745293598559567912', '888114346004205590', '700543783309148171', '985839761455448114', '888339646902308895', '885587265772998746', '528245796165124109'];


export default {

    data: new SlashCommandBuilder()
        
        .setName('insert')
        .setDescription("Insert a number of players in bulk [Developer only command]"),

    async execute(interaction) {
        
        await interaction.deferReply();

        const animeNames = ['Giorno', 'Chizuru', 'Akeno', 'David', 'Saber', 'Kurapika', 'Denji', 'Sukuna', 'Erwin', 'Johan', 'Sanji', 'Spike' ];

        for (const id of ids) {

            const player = await Player.findOne({ playerId: id });
    
            if (player) continue;

            const member = await interaction.guild.members.fetch(id);
    
            const index = Math.floor(Math.random() * animeNames.length);
            const [gameName] = animeNames.splice(index, 1);
            
            await Player.create({
                playerId: id,
                playerName: member.user.username,
                gameName,
                isAlive: true,
                role: 'none',
                item: 'none',
                canUseItem: true,
            });

        }

        await interaction.editReply(`Inserted ${ids.length} players.`);
    }
}