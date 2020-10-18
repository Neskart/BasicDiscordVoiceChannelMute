const Discord = require("discord.js");
const config = require("./config.json");

const prefix = config.COMMAND_PREFIX;
const client = new Discord.Client();

function replyLog(log_message_obj, text){
    if(config.ENABLE_MUTE_LOG == true && log_message_obj != null){
        log_message_obj.reply(text)
    }
}

function setAllChannelMembersMute(channel, active, log_message_obj = null){
    replyLog(log_message_obj, `Channel `+channel.name);
                
    for (const [memberID, member] of channel.members) {
        if(member.user.bot == false){
            replyLog(log_message_obj, `mute `+member.displayName);
            member.voice.setMute(active)
        }
    }

}


client.on("message", function(message) { 
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    
    switch(command){
        case config.COMMAND_MUTE:
            client.channels .fetch(config.ROOM_ID)
            .then(async (channel) => setAllChannelMembersMute(channel, true, message))
            .catch(console.error);
            break;
            
        case config.COMMAND_UNMUTE:
            client.channels .fetch(config.ROOM_ID)
            .then(async (channel) => setAllChannelMembersMute(channel, false, message))
            .catch(console.error);
            break;

        case config.COMMAND_LIST_ALL_CHANNEL_IDS:
            for (const [channelID, channel] of client.channels.cache) {
                if(channel.type=="voice")
                    message.reply(channel.name + " => "+channel.id)  
            }
            message.reply("========== END ");  

            break;

    }
});                                      

client.login(config.BOT_TOKEN);