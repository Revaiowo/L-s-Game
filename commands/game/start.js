import { SlashCommandBuilder, EmbedBuilder  } from "discord.js";

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

        await interaction.deferReply();
        
        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
    
        const embed = new EmbedBuilder()
            .setTitle(anime?.title || 'None')
            .setURL(anime.url)
            .setThumbnail(anime.images.jpg.image_url)
            .setDescription(anime?.synopsis || 'None')
            .addFields(
                { name: 'Studio:', value: anime.studios[0]?.name || '?' },
                { name: 'Score:', value: anime.score?.toString() || '?' },
                { name: 'Episodes:', value: anime.episodes?.toString() || '?' },
                { name: 'Rating:', value: anime.rating || '?' },
                { name: 'Status:', value: anime.status || '?' },
                { name: 'Source:', value: anime.source || '?'},
                { name: 'Aired:', value: anime.aired.string || '?' },
                { name: 'Genres:', value: genres.join(', ') || '?' }
            )
            .setTimestamp()
            .setColor('Blue')
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        await interaction.editReply({ embeds: [embed]});
    }
}