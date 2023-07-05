const { CommandType } = require('wokcommands')
const { EmbedBuilder, ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } = require('discord.js')
const { color, cancelcolor, confirmcolor, logchannel } = require("../../cfg/cfg.json")

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
            required: false,
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

        if (!member) {
            const errormsg = new EmbedBuilder()
            .setColor(cancelcolor)
            .setTitle(`Error`)
            .setDescription(`User "${member}", doesn't exist, therefore unable to kick the member for reason "${reasonOption}"`)

            interaction.reply({
                embeds: [errormsg],
                ephemeral: true,
            })

            return
        }

        if (!member.kickable) {
            const errormsg = new EmbedBuilder()
            .setColor(cancelcolor)
            .setTitle(`Error`)
            .setDescription(`User "${member}", is not able to be kicked, therefore the command hasn't kicked the member for reason "${reasonOption}"`)

            interaction.reply({
                embeds: [errormsg],
                ephemeral: true,
            })

            return
        }

        let reasonOutput = '';
        if (!reasonOption) {
            reasonOutput = 'No reason provided'
        } else {
            reasonOutput = reasonOption
        }

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
                const confirmembed = new EmbedBuilder()
                .setColor(confirmcolor)
                .setTitle(`Running Kick`)
                .setDescription(`Kicking member now...`)
                await confirmation.update({ embeds: [confirmembed], content: '', components: [] })

            } else if (confirmation.customId === 'cancel') {
                const cancelembed = new EmbedBuilder()
                .setTitle(`❌ Action Cancelled`)
                .setColor(cancelcolor)
                await confirmation.update({ embeds: [cancelembed], content: '', components: [] });

                return
            }
            } catch (e) {
            const cancelembed = new EmbedBuilder()
            .setTitle(`❌ Confirmation not received within 1 minute, cancelling`)
            .setColor(cancelcolor)
            await interaction.editReply({ content: '', components: [] });

            return
        }

        const dmembed = new EmbedBuilder()
        .setColor(color)
        .setTitle('You have been kicked!')
        .setDescription(`Dear ${member.user.username}, you have been kicked from Forza Trucking.\nReason: ${reasonOption}\nDon't worry! It is just a kick and you can join right back, however before you continue to be in our Discord please read over the rules and ensure that you understand them.\nIf you believe this is false, please feel free to open a ticket and one of our staff will take a look at the situation.`)

        const dmmember = await member.send(dmembed)

        let dmmemberOutput = '';
        if(!dmmember) {
            dmmemberOutput = 'false'

            const confirmembed = new EmbedBuilder()
            .setColor(confirmcolor)
            .setTitle(`Running Kick`)
            .setDescription(`Kicking member now...\nDM's closed...`)
            await confirmation.update({ embeds: [confirmembed], content: '', components: [] })
        } else {
            dmmemberOutput = 'true'
        }

        member.kick({ reason: reasonOutput })

        const logembed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`Kicked member`)
        .addFields(
            {
                name: 'User',
                value: member,
                inline: true,
            },
            {
                name: 'Moderator',
                value: `${interaction.user}`,
                inline: true,
            },
            {
                name: 'DMed?',
                value: dmmemberOutput,
                inline: true,
            },
            {
                name: 'Reason',
                value: reasonOutput,
                inline: true
            },
        )

        const logchan = interaction.member.guild.channels.cache.get(logchannel)

        logchan.send({ embeds: [logembed] })

        if(!visibleOption) {
            const successembedvisible = new EmbedBuilder()
            .setColor(color)
            .setTitle(`Member Kicked`)
            .setDescription(`${member} was kicked for ${reasonOutput}.`)

            interaction.followUp({
                embeds: [successembedvisible]
            })

            return
        }

        if(visibleOption === 'true') {
            const successembedvisible = new EmbedBuilder()
            .setColor(color)
            .setTitle(`Member Kicked`)
            .setDescription(`${member} was kicked for ${reasonOutput}.`)

            interaction.followUp({
                embeds: [successembedvisible]
            })
            return
        }

        if(visibleOption === 'false') {
            const successembednovisible = new EmbedBuilder()
            .setColor(color)
            .setTitle(`Completed!`)
            .setDescription(`The member was kicked successfully.`)

            interaction.followUp({
                embeds: [successembednovisible],
                ephemeral: true
            })
            return
        }
    }
}