import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Player } from "../../models/player.js"



export const isPhaseRestricted = (phase, restrictedPhases=["join"]) => restrictedPhases.includes(phase);

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

export const handleItemUse = async (interaction, player, item, targetAction, embedColor, gameMaster, title, description, selectOptions) => {
    if (isPhaseRestricted(gameMaster.phase)) {
        return interaction.editReply(`You can't use this item in ${gameMaster.phase} phase`);
    }

    const alivePlayers = await Player.find({ isAlive: true, playerId: { $ne: player.playerId } });
    const options = selectOptions || alivePlayers.map(player => ({
        label: player.gameName,
        value: player.playerId
    }));

    const embed = createEmbed(embedColor, title || `Use ${item}`, description || `Choose a target to use your ${item} on.`);
    const menuRow = createDropdownMenu("target", `Select target for ${item}`, options);
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


const ITEM_CONFIGS = {
    "Bat": {
      color: "#FFEA00",
      resultTitle: "The Smack of bat!",
      resultDescription: (targetName) => `You smacked ${targetName} in the face with the bat. they wont be able to use their item this round(might not even move).`,
      notifyTitle: "You have been Hit by a Bat!",
      notifyDescription: "You have been smacked and you won't be able to use your item this round."
    },
    "Knife": {
      color: "#FF0000",
      resultTitle: "The Knife strikes!",
      resultDescription: (targetName) => `Aha stabbed ${targetName} with a grin.`,
      notifyTitle: "You've been stabbed!",
      notifyDescription: "You have been killed by a knife."
    },
    "Toxin": {
      color: "#800080",
      resultTitle: "The Toxin takes effect!",
      resultDescription: (targetName) => `You poisoned ${targetName} like a true assassin. May ${targetName} rest in peace`,
      notifyTitle: "You've been poisoned!",
      notifyDescription: "You have been killed by a toxin."
    },
    "Gun": {
      color: "#A52A2A",
      resultTitle: "The Gun fires!",
      resultDescription: (targetName) => `${targetName} has been shot and killed. you got better aim than americans in olympics.`,
      notifyTitle: "You've been shot!",
      notifyDescription: "You have been killed by a gunshot."
    },
    "Revival Stone": {
      color: "#00FF00",
      resultTitle: "The Resurection Stone is used!",
      resultDescription: (targetName) => `${targetName} has been revived. you are a life saver!`,
      notifyTitle: "WoW you lucky bastard!",
      notifyDescription: "You have been revived. Welcome back to the game!"
    }
  };
  
export const createResultEmbed = async (player, targetId, item) => {
    const targetPlayer = await Player.findOne({ playerId: targetId });
    const config = ITEM_CONFIGS[item] || {
        color: "#808080",
        resultTitle: `Item ${item} used!`,
        resultDescription: (targetName) => `The item ${item} was used on ${targetName}.`
    };

    return createEmbed(
        config.color,
        config.resultTitle,
        config.resultDescription(targetPlayer.gameName, player.gameName)
    );
};

export const notifyTarget = async (interaction, targetId, item) => {
    const target = await interaction.client.users.fetch(targetId);
    const config = ITEM_CONFIGS[item] || {
        color: "#808080",
        notifyTitle: "An item was used on you!",
        notifyDescription: `An unknown item named ${item} was used on you by ${interaction.user.username}.`
    };

    const embed = createEmbed(
        config.color,
        config.notifyTitle,
        config.notifyDescription
    );
    await target.send({ embeds: [embed] });
};

