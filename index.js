const {
    Client,
    IntentsBitField,
    ActivityType
} = require('discord.js')
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildPresences
    ],
    ws: {
        properties: {
            browser: 'Discord iOS'
        }
    },
})
require('dotenv').config()

client.on('ready', () => {
    console.log(`${client.user.username} is online.`)

    client.user.setActivity({
        name: "myself being coded",
        type: ActivityType.Watching
    })
})

client.login(process.env.TOKEN)