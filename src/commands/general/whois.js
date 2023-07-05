const { CommandType } = require('wokcommands')
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const { color } = require("../../cfg/cfg.json")

module.exports = {
    description: "Sends information about a user",
    type: CommandType.SLASH,
    testOnly: true,
    guildOnly: true,

    options: [
        {
            name: 'user',
            description: 'The user for the command',
            required: true,
            type: ApplicationCommandOptionType.User,
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

        const visibleOption = interaction.options.getString('visible')
        const discriminator = userOption.id

        let discriminatorOutput = '';
        if (userOption.discriminator === '0') {
            discriminatorOutput = 'deprecated';
        } else {
            discriminatorOutput = userOption.discriminator;
        }

        const reply = new EmbedBuilder()
        .setColor(color)
        .setTitle(`User ${userOption.username}'s info.`)
        .addFields(
        {
            name: 'Username',
            value: `${userOption.username}`,
            inline: true
        },
        {
            name: 'Discriminator',
            value: discriminatorOutput,
            inline: true
        }, 
        {
            name: 'User ID',
            value: `\`${userOption.id}\``,
            inline: true
        }, 
        {
            name: 'Is Bot?',
            value: `${member.user.bot}`,
            inline: true
        }, 
        {
            name: 'Joined Server',
            value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
            inline: true
        }, 
        {
            name: 'Joined Discord',
            value: `<t:${parseInt(userOption.createdAt / 1000)}:R>`,
            inline: true
        }, 
        {
            name: 'Role List',
            value: `${member.roles.cache.map(r => r).join(' ')}`,
            inline: false
        })

        if(!visibleOption) {
            interaction.reply({
                embeds: [reply]
            })

            return
        }

        if(visibleOption === 'true') {
            interaction.reply({
                embeds: [reply]
            })

            return
        }

        if(visibleOption === 'false') {
            interaction.reply({
                embeds: [reply],
                ephemeral: true,
            })

            return
        }

    }
}