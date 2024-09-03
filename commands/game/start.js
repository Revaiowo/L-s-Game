import { SlashCommandBuilder, EmbedBuilder  } from "discord.js";
import { GameMaster } from "../../models/gameMaster.js";
import { Player } from "../../models/player.js";
import { getRoles } from "../../utility/roles.js";
import { giveItems } from "../../utility/items.js";
import { distributeInfo } from "../../utility/info.js";


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

        const gameMaster = await GameMaster.findOne();

        if (!gameMaster)
        
            await GameMaster.create({
                game: true,
                channelId,
                phase: 'join',
                LDies: false,
                nearDies: false,
                kiraDies: false,
                gameRound: false,
            });

        if (gameMaster.game) return await channel.send('A game is already going on.')
        
        await channel.send("Join L's Game using the /join command.");

        /* ------------------------ JOIN PHASE ------------------------ */

        // wait for users to join
        // make a mechanism where the code waits here for either a certain amount of time or when max players have joined the game

        // after all players have joined ->


        const players = await Player.find();

        const playersInfo = players.map(player => ({
            gameName: player.gameName,
            playerId: player.playerId,
            playerName: player.playerName
        }));

        // await channel.send('Player list-');

        // for (const [i, player] of playersInfo.entries()){

        //     await channel.send(`${i+1}.) ${player.gameName}`);
        // };

        await channel.send('Disributing roles.....');

        // ------------------------- ROLE & ITEM DISTRIBUTION -----------------------

        const roles = getRoles(playersInfo);
        
        for (const [i, player] of playersInfo.entries()){
            
            await Player.findOneAndUpdate({ playerId: player.playerId }, { $set: { role: roles[i] } });
            player.role = roles[i];
        }
        
        // inserts every player's items in the object of playerInfo array
        giveItems(playersInfo);

        for (const player of playersInfo){
            
            await Player.findOneAndUpdate({ playerId: player.playerId }, { $set: { item: player.item } });
        }       

        distributeInfo(playersInfo);
    }
}