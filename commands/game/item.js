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



// Helper to disable components
const disableComponents = (menuRow, buttonRow) => {
    menuRow.components.forEach((component) => component.setDisabled(true));
    buttonRow.components.forEach((component) => component.setDisabled(true));
};

// Helper to check if phase allows using item
const isPhaseRestricted = (phase) => ["join", "vote"].includes(phase);

// Reusable function to create a dropdown menu (select menu)
const createDropdownMenu = (customId, placeholder, options) => {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder(placeholder)
        .addOptions(options);

    return new ActionRowBuilder().addComponents(selectMenu);
};

// Reusable function to create a cancel button
const createCancelButton = () => {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
    );
}




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
        const alivePlayers = await Player.find({ isAlive: true, playerId: { $ne: player.playerId }});

        switch (item) {
            case "Bat":
                if (gameMaster.phase === "join" || gameMaster.phase === 'vote') {
                    return interaction.editReply(`You can't use this item in ${gameMaster.phase} phase`);
                }

                const embed = new EmbedBuilder()
                    .setColor("#FFEA00")
                    .setTitle(`Smash a skull with your bat!`)
                    .setDescription(
                        `Using the bat item will disable the ability of the targeted players to use items.`
                    );

                const selectOptions = alivePlayers
                    .filter(player => player.canUseItem, )
                    .map(player => ({
                        label: player.gameName,
                        value: player.playerId
                    }));

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId("target")
                    .setPlaceholder("Smack grandpa")
                    .addOptions(selectOptions);

                const cancelButton = new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Danger);

                const menuRow = createDropdownMenu("target", "Smack grandpa", selectOptions);
                const buttonRow = createCancelButton()
                const collector = interaction.channel.createMessageComponentCollector({
                    time: 30000,
                });

                // do more stuff here

                collector.on("collect", async (i) => {
                    await i.deferUpdate();
                    disableComponents(menuRow, buttonRow);

                    if (i.customId === "target") {
                        // i.collector.stop()
                        const targetId = i.values[0];
                        await Player.updateOne(
                            { playerId: targetId },
                            { $set: { canUseItem: false } }
                        );

                        await Player.updateOne(
                            { playerId: player.playerId },
                            { $set: { canUseItem: false } }
                        );

                        const embed = new EmbedBuilder()
                            .setColor("#FFEA00")
                            .setTitle(`The Smack of bat!`)
                            .setDescription(
                                `${(await Player.findOne({playerId: targetId})).gameName} wont be able to move for a while forget about using items.`
                            )

                        await interaction.followUp({ embeds: [embed] });
                        await interaction.editReply({ components: [menuRow, buttonRow] });

                        const target = await interaction.client.users.fetch(targetId);
                        await target.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#FFEA00")
                                    .setTitle("You have been Hit by a Bat!")
                                    .setDescription(
                                        `You have been smacked and you wont be able to use your item this round.`
                                    )
                            ]
                        })
                    }
                });
                await interaction.editReply({
                    embeds: [embed],
                    components: [menuRow, buttonRow],
                });

        }


        if (killingItems.includes(item)) {

            if (gameMaster.phase === "join" || gameMaster.phase === 'vote') {
                return interaction.editReply(`You can't use this item in ${gameMaster.phase} phase`);
            }

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

            const menuRow = createDropdownMenu("target", "Kill grandma", selectOptions);
            const buttonRow = createCancelButton()
            const collector = interaction.channel.createMessageComponentCollector({
                time: 30000,
            });

            collector.on("collect", async (i) => {

                await i.deferUpdate();
                disableComponents(menuRow, buttonRow);

                if (i.customId === "target") {

                    collector.stop();

                    const targetPlayerId = i.values[0];
                    // const targetPlayerToDm = await interaction.guild.members.fetch(targetPlayerId); // use this to send the user a dm telling him he died

                    const targetPlayer = await Player.findOne({ playerId: targetPlayerId });

                    await Player.updateOne(
                        { playerId: targetPlayerId },
                        { $set: { isAlive: false } }
                    );

                    await Player.updateOne(
                        { playerId: player.playerId },
                        { $set: { canUseItem: false } }
                    );
                    console.log(targetPlayer);
                    const embed = new EmbedBuilder()
                        .setColor("#FF0000")
                        .setTitle(`I hope using the ${item} was worth it`)
                        .setDescription(`The player ${targetPlayer.gameName} has been killed.`);

                    await i.followUp({ embeds: [embed] });
                    await interaction.editReply({ components: [menuRow, buttonRow] });

                    // Dm player about their death
                    const target = await interaction.client.users.fetch(targetPlayerId);
                    await target.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FF0000")
                                .setTitle("Tough luck buddy!")
                                .setDescription(
                                    `You have been killed by ${player.gameName}.`
                                )
                        ]
                    })
                    
                } else if (i.customId === "cancel") {

                    await i.deferUpdate();

                    collector.stop();

                    await i.followUp({ content: "You have cancelled the item use.", components: [menuRow, buttonRow] });
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
