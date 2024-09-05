import { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";
import { GameMaster } from "../../models/gameMaster.js";

export default {
	data: new SlashCommandBuilder()
		.setName('changephase')
		.setDescription('Change the game phase [Development only command]')
		.addStringOption(option =>
			option
				.setName('phase')
				.setDescription('The phase to change to')
				.setRequired(true)
				.addChoices(
					{ name: 'Join', value: 'join' },
					{ name: 'Remark', value: 'remark' },
					{ name: 'Vote', value: 'vote' },
					{ name: 'L Reasoning', value: 'L' },
					{ name: 'Kira Judgement', value: 'kira' },
				)
		),

	async execute(interaction) {
		const gameMaster = await GameMaster.findOne();
		const phase = interaction.options.getString('phase');
		gameMaster.phase = phase;
		await gameMaster.save();
		await interaction.reply(`The game phase has been changed to ${phase}`);
	}
};
