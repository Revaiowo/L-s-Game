import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { client } from '../../index.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const startRemarkPhase = async (playerInfo, channel) => {

    for (const player of playerInfo) {

        const button = new ButtonBuilder()
            .setCustomId('remark')
            .setLabel('Remark')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(button);


        await channel.send(`${player.gameName}'s turn to give remark.`);

        const currentPlayer = await client.users.fetch(player.playerId);
        await currentPlayer.send({ 
            content: "**It's your turn in L's game**\nWhat would you like to do?", 
            components: [row] 
        });
        return
        await delay(1000 * 10);
    }
};