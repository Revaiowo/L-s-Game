import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Player } from "../../models/player.js"



export const isPhaseRestricted = (phase) => ["join", "vote"].includes(phase);

export const createEmbed = (color, title, description) => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);
};

export const createDropdownMenu = (customId, placeholder, options) => {
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder(placeholder)
        .addOptions(options);

    return new ActionRowBuilder().addComponents(selectMenu);
};

export const createCancelButton = () => {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
    );
};

export const disableComponents = (menuRow, buttonRow) => {
    menuRow.components.forEach((component) => component.setDisabled(true));
    buttonRow.components.forEach((component) => component.setDisabled(true));
};

export const handleItemUse = async (interaction, player, item, targetAction, embedColor, gameMaster) => {
    if (isPhaseRestricted(gameMaster.phase)) {
        return interaction.editReply(`You can't use this item in ${gameMaster.phase} phase`);
    }

    const alivePlayers = await Player.find({ isAlive: true, playerId: { $ne: player.playerId } });
    const selectOptions = alivePlayers.map(player => ({
        label: player.gameName,
        value: player.playerId
    }));

    const embed = createEmbed(embedColor, `Use ${item}`, `Choose a target to use your ${item} on.`);
    const menuRow = createDropdownMenu("target", `Select target for ${item}`, selectOptions);
    const buttonRow = createCancelButton();

    const collector = interaction.channel.createMessageComponentCollector({ time: 30000 });

    collector.on("collect", async (i) => {
        await i.deferUpdate();
        disableComponents(menuRow, buttonRow);

        if (i.customId === "target") {
            collector.stop();
            const targetId = i.values[0];
            await targetAction(player, targetId, item);
            
            const resultEmbed = await createResultEmbed(player, targetId, item);
            await i.followUp({ embeds: [resultEmbed] });
            await interaction.editReply({ components: [menuRow, buttonRow] });

            await notifyTarget(interaction, targetId, item);
        } else if (i.customId === "cancel") {
            collector.stop();
            await i.followUp({ content: "You have cancelled the item use.", components: [menuRow, buttonRow] });
        }
    });

    await interaction.editReply({
        embeds: [embed],
        components: [menuRow, buttonRow],
    });
};

export const createResultEmbed = async (player, targetId, item) => {
    const targetPlayer = await Player.findOne({ playerId: targetId });
    const color = item === "Bat" ? "#FFEA00" : "#FF0000";
    const title = item === "Bat" ? "The Smack of bat!" : `I hope using the ${item} was worth it`;
    const description = item === "Bat" 
        ? `${targetPlayer.gameName} won't be able to move for a while, forget about using items.`
        : `The player ${targetPlayer.gameName} has been killed.`;
    
    return createEmbed(color, title, description);
};

export const notifyTarget = async (interaction, targetId, item) => {
    const target = await interaction.client.users.fetch(targetId);
    const color = item === "Bat" ? "#FFEA00" : "#FF0000";
    const title = item === "Bat" ? "You have been Hit by a Bat!" : "Tough luck buddy!";
    const description = item === "Bat"
        ? `You have been smacked and you won't be able to use your item this round.`
        : `You have been killed by ${interaction.user.username}.`;

    const embed = createEmbed(color, title, description);
    await target.send({ embeds: [embed] });
};