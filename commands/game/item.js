import {
    SlashCommandBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";

import { GameMaster } from "../../models/gameMaster.js";
import { Player } from "../../models/player.js";
import { handleItemUse } from "../../utility/items/itemLogic.js";




export default {
    data: new SlashCommandBuilder()
        .setName("item")
        .setDescription("Use your item"),

    async execute(interaction) {
        await interaction.deferReply();

        const gameMaster = await GameMaster.findOne();
        const player = await Player.findOne({ playerId: interaction.user.id });

        if (!gameMaster) {
            return interaction.editReply(`There is no game going on.`);
        }

        if (!player) {
            return interaction.editReply(`You are not in the game.`);
        }

        
        if (!player.isAlive) {
            return interaction.editReply(`Ayo, the dead cant play.`);
        }
        

        const { item, canUseItem } = player;

        if (!canUseItem) {
            return interaction.editReply(`You can't use the ${item}.`);
        }

        const killingItems = ["Knife", "Toxin", "Gun"];

        if (item === "Bat") {
            const players = await Player.find({ isAlive: true, playerId: { $ne: player.playerId }, canUseItem: true });
            const options = players.map(player => ({
                label: player.gameName,
                value: player.playerId,
            }));
            await handleItemUse(
                interaction,
                player,
                item,
                async (player, targetId) => {
                    await Player.updateOne({ playerId: targetId }, { $set: { canUseItem: false } });
                    await Player.updateOne({ playerId: player.playerId }, { $set: { canUseItem: false } });
                },
                "#FFEA00",
                gameMaster,
                "The Smack of bat!",
                "The player wont be able to move for a while forget about using items.",
                options

            );
        } else if (killingItems.includes(item)) {
            const alivePlayers = await Player.find({ isAlive: true, playerId: { $ne: player.playerId } });
            const options = alivePlayers.map(player => ({
                label: player.gameName,
                value: player.playerId
            }));
            await handleItemUse(
                interaction,
                player,
                item,
                async (player, targetId) => {
                    await Player.updateOne({ playerId: targetId }, { $set: { isAlive: false } });
                    await Player.updateOne({ playerId: player.playerId }, { $set: { canUseItem: false } });

                    const killedPlayer = await Player.findOne({ playerId: targetId });
                    if (killedPlayer.role === 'L') {
                        const Near = await Player.findOne({ item: 'Mythical Chocolate' });
                        if (Near && Near.isAlive) {
                            await Player.updateOne({ playerId: Near.playerId }, { $set: { item: '100IQ' } });
                        }
                    }
                },
                "#FF0000",
                gameMaster,
                `The ${item} of Justice.`,
                "Every decision counts. Choose wisely, for the line between justice and murder is thin.",
                options
            );
        } else if (item === "Revival Stone") {

            const deadPlayers = await Player.find({ isAlive: false });
            const options = deadPlayers.map(player => ({
                label: player.gameName,
                value: player.playerId
            }));

            await handleItemUse(
                interaction,
                player,
                item,
                async (player, targetId) => {
                    const targetPlayer = await Player.findOne({ playerId: targetId });
                    if (targetPlayer.role === 'L') {
                        await interaction.followUp({ content: "You cannot revive L with the Revival Stone.", ephemeral: true });
                    }

                    await Player.updateOne({ playerId: targetId }, { $set: { isAlive: true } });
                    await Player.updateOne({ playerId: player.playerId }, { $set: { canUseItem: false } });

                },
                "#00FF00",
                gameMaster,
                "You may use the Stone of life.",
                "The revivial stone is a rare stone which can revive a dead person. use it wisely.",
                options
                
            ) 
        } else {
            return interaction.editReply(`Your item is ${item}.`);
        }
    },
};


