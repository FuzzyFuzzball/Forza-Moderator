const { Client, IntentsBitField, ActivityType } = require('discord.js')
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMessages, 
        IntentsBitField.Flags.MessageContent, 
        IntentsBitField.Flags.GuildMembers, 
        IntentsBitField.Flags.GuildPresences
    ],
})
const path = require('path')
const { DefaultCommands } = require('wokcommands')
const wokcommands = require('wokcommands')
require('dotenv').config()

client.on('ready', () => {
    console.log(`${client.user.username} is online.`)

    client.user.setActivity({
        name: "myself being coded",
        type: ActivityType.Watching
    })

    client.user.setStatus('dnd');

    new wokcommands({
        client,
        commandsDir: path.join(__dirname, "commands"),
        testServers: ["1085971621065531495"],
        botOwners: ["1084922446248951828", "1087348479015260254"],
        disabledDefaultCommands: [
            DefaultCommands.ChannelCommand,
            DefaultCommands.CustomCommand,
            DefaultCommands.Prefix,
            DefaultCommands.RequiredPermissions,
            DefaultCommands.RequiredRoles,
            DefaultCommands.ToggleCommand
        ],
    })    
})

client.login(process.env.TOKEN)