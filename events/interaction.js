import { ActionRowBuilder, ButtonBuilder, Events } from 'discord.js';
import { Collection } from 'discord.js';
import { handleError } from '../handlers/errorHandler.js';
// import { remarkButton } from '../buttons/remark.js';

export default {

	name: Events.InteractionCreate,

	async execute(interaction) {

		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);
			const { cooldowns } = interaction.client;

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
			
			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}

			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const defaultCooldownDuration = 3;
			const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const expiredTimestamp = Math.round(expirationTime / 1_000);
					return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			try {
				await command.execute(interaction);
			} catch (error) {
				handleError(interaction, error);
			}
		}	

		else if (interaction.isButton()) {

			const button = interaction.client.buttons.get(interaction.customId);

			if (!button)
				return console.error(`No button matching ${interaction.customId} was found.`);

			try {
				await button.execute(interaction);
				
				// Disable the button after it's clicked
                const originalButton = ButtonBuilder.from(interaction.component);
                const disabledButton = ButtonBuilder.from(originalButton).setDisabled(true);

                const row = new ActionRowBuilder().addComponents(disabledButton);

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.update({ components: [row] });
                } else {
                    await interaction.message.edit({ components: [row] });
                }

			} catch (error) {
				console.error(error);
			}

			// if (interaction.customId === 'remark') {
			// 	await remarkButton(interaction);
			// }
		}
	},
};