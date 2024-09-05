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

<<<<<<< HEAD
=======
        const { item, canUseItem } = player;

        const killingItems = ["Knife", "Toxin", "Gun"];
        const alivePlayers = await Player.find({ isAlive: true });
>>>>>>> 7b3161cb8f3af25ef0ca1c150d58c7dfa28d2804

        if (!gameMaster) {
            return interaction.editReply(`There is no game going on.`);
        }

        if (!player) {
            return interaction.editReply(`You are not in the game.`);
        }

<<<<<<< HEAD

        const { item, canUseItem } = player;

        const killingItems = ["Knife", "Toxin", "Gun"];
        const alivePlayers = await Player.find({ isAlive: true, playerId: { $ne: interaction.user.id } });

        
=======
>>>>>>> 7b3161cb8f3af25ef0ca1c150d58c7dfa28d2804
        if (!canUseItem) {
            return interaction.editReply(`You can't use ${item}.`);
        }

<<<<<<< HEAD


        if (killingItems.includes(item)) {

            if (gameMaster.phase === "join" || gameMaster.phase === 'vote') {
                return interaction.editReply(`You can't use this item in ${gameMaster.phase} phase`);
            }

=======
        if (gameMaster.phase === "join" || gameMaster.phase === 'vote') {
            return interaction.editReply(`You can't use this item in ${gameMaster.phase} phase`);
        }

        if (killingItems.includes(item)) {

>>>>>>> 7b3161cb8f3af25ef0ca1c150d58c7dfa28d2804
            const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle(`The ${item} of Justice`)
                .setDescription(
                    `Every decision counts. Choose wisely, for the line between justice and murder is thin.`
                );

            const selectOptions = alivePlayers.map(player => ({
                label: player.gameName,
<<<<<<< HEAD
                value: player.playerId.toString()
=======
                value: player.playerId
>>>>>>> 7b3161cb8f3af25ef0ca1c150d58c7dfa28d2804
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
<<<<<<< HEAD
            console.log(alivePlayers);
=======

>>>>>>> 7b3161cb8f3af25ef0ca1c150d58c7dfa28d2804
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
<<<<<<< HEAD
                    
                    // const targetPlayerToDm = await i.guild.members.fetch(targetPlayerId); // use this to send the user a dm telling him he died
                    // console.log(`Successfully fetched member: ${targetPlayerToDm.user.tag}`);
=======
                    const targetPlayerToDm = await interaction.guild.members.fetch(targetPlayerId); // use this to send the user a dm telling him he died
>>>>>>> 7b3161cb8f3af25ef0ca1c150d58c7dfa28d2804

                    const targetPlayer = await Player.findOne({ playerId: targetPlayerId });

                    await Player.updateOne(
<<<<<<< HEAD
                        { playerId: targetPlayerId },
=======
                        { playerId: targetPlayerId},  
>>>>>>> 7b3161cb8f3af25ef0ca1c150d58c7dfa28d2804
                        { $set: { isAlive: false } }
                    );

                    await Player.updateOne(
<<<<<<< HEAD
                        { playerId: player.playerId },
=======
                        { playerId: player.playerId},
>>>>>>> 7b3161cb8f3af25ef0ca1c150d58c7dfa28d2804
                        { $set: { canUseItem: false } }
                    );

                    const embed = new EmbedBuilder()
                        .setColor("#FF0000")
                        .setTitle(`I hope using the ${item} was worth it`)
                        .setDescription(`The player ${targetPlayer.gameName} has been killed.`);

<<<<<<< HEAD
                    await i.followUp({ embeds: [embed] });
=======
                    await i.followUp({ embeds: [embed] }); 
>>>>>>> 7b3161cb8f3af25ef0ca1c150d58c7dfa28d2804
                    await interaction.editReply({ components: [menuRow, buttonRow] });

                } else if (i.customId === "cancel") {

                    await i.deferUpdate();

                    collector.stop();

<<<<<<< HEAD
                    await i.followUp({ content: "You have cancelled the item use.", components: [menuRow, buttonRow] });
=======
                    await i.followUp({content: "You have cancelled the item use.", components: [menuRow, buttonRow] });
>>>>>>> 7b3161cb8f3af25ef0ca1c150d58c7dfa28d2804
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
