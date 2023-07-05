const { CommandType } = require('wokcommands')
const { EmbedBuilder } = require('discord.js')
const { color } = require("../../cfg/cfg.json")

module.exports = {
    description: "Sends the ping of the bot",
    type: CommandType.SLASH,
    testOnly: true,
    guildOnly: true,
    
    callback: ({ interaction, client }) => {
        const ping = client.ws.ping

        const reply = new EmbedBuilder()
        .setTitle(`The bot ping is ${ping}ms.`)
        .setColor(color)

        interaction.reply({ embeds: [reply] })
    }
}