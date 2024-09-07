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

        const { item, canUseItem } = player;

        if (!canUseItem) {
            return interaction.editReply(`You can't use the ${item}.`);
        }

        const killingItems = ["Knife", "Toxin", "Gun"];

        if (item === "Bat") {
            await handleItemUse(
                interaction,
                player,
                item,
                async (player, targetId) => {
                    await Player.updateOne({ playerId: targetId }, { $set: { canUseItem: false } });
                    await Player.updateOne({ playerId: player.playerId }, { $set: { canUseItem: false } });
                },
                "#FFEA00",
                gameMaster
            );
        } else if (killingItems.includes(item)) {
            await handleItemUse(
                interaction,
                player,
                item,
                async (player, targetId) => {
                    await Player.updateOne({ playerId: targetId }, { $set: { isAlive: false } });
                    await Player.updateOne({ playerId: player.playerId }, { $set: { canUseItem: false } });
                },
                "#FF0000",
                gameMaster
            );
        } else {
            return interaction.editReply(`Your item is ${item}.`);
        }
    },
};


