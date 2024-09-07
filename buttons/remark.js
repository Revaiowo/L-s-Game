import { ButtonBuilder } from "discord.js";
import { GameMaster } from "../models/gameMaster.js";
import { Player } from "../models/player.js";

export default {

    customId: 'remark',

    async execute(interaction) {

        await interaction.reply('Write your remark:');
    
        const { channelId } = await GameMaster.findOne();
        const channel = await interaction.client.channels.fetch(channelId);
        
        const filter = (response) => response.author.id === interaction.user.id;
        
        const dmChannel = await interaction.user.createDM();
        const collector = dmChannel.createMessageCollector({ filter, time: 60000 });
        
        collector.on('collect', async (message) => {

            const player = await Player.findOne({ playerId: message.author.id });
            await channel.send(`${player.gameName}'s remark:\n> ${message.content}`);
            
            collector.stop();
        })

        collector.on('end', (collected, reason) => {
            
            if (reason === 'time')
                interaction.followUp('You did not respond in time.')
            else
                interaction.followUp('Sent your remark!');
        })
    }
}
