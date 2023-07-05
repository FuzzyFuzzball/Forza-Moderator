const { CommandType } = require('wokcommands')
const { EmbedBuilder, ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } = require('discord.js')
const { color, cancelcolor } = require("../../cfg/cfg.json")

module.exports = {
    description: "Kicks a user from the discord",
    type: CommandType.SLASH,
    testOnly: true,
    guildOnly: true,
    ownerOnly: true,

    options: [
        {
            name: 'user',
            description: 'The user for the command',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'reason',
            description: 'The reason for the kick',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'visible',
            description: 'Will the command be visible to the channel? (Default: True)',
            required: false,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'True',
                    value: 'true',
                },
                {
                    name: 'False',
                    value: 'false'
                }
            ],
        },
    ],

    callback: async ({ interaction, user }) => {
        const userOption = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(userOption.id)
        const reasonOption = interaction.options.getString('reason')
        const visibleOption = interaction.options.getString('visible')

        const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirm')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success)

        const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setEmoji('❌')
        .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder()
        .addComponents(confirm, cancel)

        const response = await interaction.reply({
            content: `This is a test`,
            components: [row],
            ephemeral: true,
        })

        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        
            if (confirmation.customId === 'confirm') {
                return
            } else if (confirmation.customId === 'cancel') {
                const cancelembed = new EmbedBuilder()
                .setTitle(`❌ Action Cancelled`)
                await confirmation.update({ embeds: [cancelembed], content: '', components: [] });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }

    }
}