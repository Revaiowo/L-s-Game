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

export default {
    data: new SlashCommandBuilder()

        .setName("item")
        .setDescription("Use your item"),

    async execute(interaction) {
        await interaction.deferReply();

        const gameMaster = await GameMaster.findOne();

        const player = await Player.findOne({ playerId: interaction.user.id });

        const { item, canUseItem } = player;

        const killingItems = ["Knife", "Toxin", "Gun"];
        const alivePlayers = await Player.find({ isAlive: true });

        if (!gameMaster) {
            return interaction.editReply(`There is no game going on.`);
        }

        if (!player) {
            return interaction.editReply(`You are not in the game.`);
        }

        if (!canUseItem) {
            return interaction.editReply(`You can't use ${item}.`);
        }

        if (gameMaster.phase === "join" || gameMaster.phase === 'vote') {
            return interaction.editReply(`You can't use this item in ${gameMaster.phase} phase`);
        }

        if (killingItems.includes(item)) {

            const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle(`The ${item} of Justice`)
                .setDescription(
                    `Every decision counts. Choose wisely, for the line between justice and murder is thin.`
                );

            const selectOptions = alivePlayers.map(player => ({
                label: player.gameName,
                value: player.playerId
            }));

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("target")
                .setPlaceholder("Kill grandma")
                .addOptions(selectOptions);

            const cancelButton = new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Danger);

            const menuRow = new ActionRowBuilder().addComponents(selectMenu);
            const buttonRow = new ActionRowBuilder().addComponents(cancelButton);

            const collector = interaction.channel.createMessageComponentCollector({
                time: 30000,
            });

            collector.on("collect", async (i) => {

                await i.deferUpdate();

                menuRow.components.forEach(component => component.setDisabled(true));
                buttonRow.components.forEach(component => component.setDisabled(true));

                if (i.customId === "target") {

                    collector.stop();

                    const targetPlayerId = i.values[0];
                    const targetPlayerToDm = await interaction.guild.members.fetch(targetPlayerId); // use this to send the user a dm telling him he died

                    const targetPlayer = await Player.findOne({ playerId: targetPlayerId });

                    await Player.updateOne(
                        { playerId: targetPlayerId},  
                        { $set: { isAlive: false } }
                    );

                    await Player.updateOne(
                        { playerId: player.playerId},
                        { $set: { canUseItem: false } }
                    );

                    const embed = new EmbedBuilder()
                        .setColor("#FF0000")
                        .setTitle(`I hope using the ${item} was worth it`)
                        .setDescription(`The player ${targetPlayer.gameName} has been killed.`);

                    await i.followUp({ embeds: [embed] }); 
                    await interaction.editReply({ components: [menuRow, buttonRow] });

                } else if (i.customId === "cancel") {

                    await i.deferUpdate();

                    collector.stop();

                    await i.followUp({content: "You have cancelled the item use.", components: [menuRow, buttonRow] });
                }
            });

            collector.on("end", async (collected) => {
                if (collected.size === 0) {
                    await disableComponents(interaction);
                    console.log("Times up!");
                }
            });

            await interaction.editReply({
                embeds: [embed],
                components: [menuRow, buttonRow],
            });
        } else {
            return interaction.editReply(`Your item is ${item}.`);
        }
    },
};
