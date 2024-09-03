import { SlashCommandBuilder } from "discord.js";
import { Player } from "../../models/player.js";

const ids = ['468392588790071296', '745293598559567912', '888114346004205590', '700543783309148171', '985839761455448114', '888339646902308895', '885587265772998746', '528245796165124109', '487674831391686673', '1079372837111996547'];


export default {

    data: new SlashCommandBuilder()
        
        .setName('insert')
        .setDescription("Insert a number of players in bulk [Developer only command]")

        .addNumberOption(opton =>
            opton
                .setName('number')
                .setDescription('Number of players you want to insert')
        ),

    async execute(interaction) {
        
        await interaction.deferReply();

        const playerCount = interaction.options.getNumber('number') || ids.length;

        if (playerCount > ids.length)
            return interaction.editReply(`The max ids you can insert is ${ids.length}.`);

        const animeNames = ['Giorno', 'Chizuru', 'Akeno', 'David', 'Saber', 'Kurapika', 'Denji', 'Sukuna', 'Erwin', 'Johan', 'Sanji', 'Spike' ];

        for (let i=0; i < playerCount; i++) {

            const player = await Player.findOne({ playerId: ids[i] });
    
            if (player) continue;

            const member = await interaction.guild.members.fetch(ids[i]);
    
            const index = Math.floor(Math.random() * animeNames.length);
            const [gameName] = animeNames.splice(index, 1);
            
            await Player.create({
                playerId: ids[i],
                playerName: member.user.username,
                gameName,
                isAlive: true,
                role: 'none',
                item: 'none',
                canUseItem: true,
            });

        }

        await interaction.editReply(`Inserted ${playerCount} players.`);
    }
}