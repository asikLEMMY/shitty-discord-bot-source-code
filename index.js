const {
    Client,
    Intents
} = require('discord.js');
const ms = require('ms')


const prefix = "m."
const Discord = require('discord.js');
const Canvas = require('canvas');




const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

const afkUsers = []

bot.on("messageCreate", function(message) {
    if (afkUsers.includes(message.author.id)) {
        message.reply("I removed your AFK status.");
        let i = afkUsers.indexOf(message.author.id);
        afkUsers.splice(i, 1);
        console.log(afkUsers);
    }
    
    message.mentions.users.forEach((user) => {
        if (message.author.bot) return false;
      
        if (
         message.content.includes('@here') ||
         message.content.includes('@everyone')
        )
         return false;
        if (afkUsers.includes(user.id))
         message.reply(
          `${message.author}, the user you mentioned is currently AFK.. Leave a message if urgent by DMing him/her`
        );
    });
});


bot.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    if (command === "help") {
        let commandList = ["ban (For Administrators.)", "kick (For Administrators.)", "avatar {User}", "afk", "duel"];
        let embed = new Discord.MessageEmbed()
        .setTitle("Help")
        .setColor('RANDOM')
        .setTimestamp(Date.now())
        .setFields(
            {name: "Commands (There is " + commandList.length + " available commands!)", value: commandList.join("\n")}
        )
        .setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL()}`);
        message.channel.send({content: ` `, embeds:[embed]});
    }
    else if (command === "ban") {
        if (message.guild.me.permissions.has("BAN_MEMBERS")) {
        if (message.member.permissions.has("BAN_MEMBERS")) {
        let user = message.mentions.users.first();
        let reason = message.content.slice((prefix + command + user + 5).length)
        if(!user) return message.reply("$ban {User}, {Reason}");
        if(!reason) {
            reason = "non-reasoned.";
        }
        let member = message.guild.members.cache.get(user.id)
        if (member.permissions.has("BAN_MEMBERS")) return message.reply("The person that youre trying to ban, is at the same administrator level as you!");
        let embed = new Discord.MessageEmbed()
        .setTitle(`Ban`)
        .setFields(
            {name: "User that got banned", value: `${user.tag}`},
            {name: "Reason", value: "" + reason}
        )
        .setThumbnail(user.displayAvatarURL({dynamic : true}) + '?size=4096')
        .setTimestamp(Date.now())
        .setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL()}`);
        message.channel.send({content: ` `, embeds:[embed]});
        member.ban({reason: reason})
        }
        else {
            message.reply("I dont have sufficient permissions.")
        }
       } else {
        message.reply("You dont have sufficient permissions!");
      }
     }
     else if (command === 'kick') {
        if (message.guild.me.permissions.has("BAN_MEMBERS")) {
            if (message.member.permissions.has("KICK_MEMBERS")) {
            let user = message.mentions.users.first();
            let reason = message.content.slice((prefix + command + user + 5).length)
            if(!user) return message.reply("$kick {User}, {Reason}");
            if(!reason) {
                reason = "non-reasoned.";
            }
            let member = message.guild.members.cache.get(user.id)
            if (member.permissions.has("KICK_MEMBERS")) return message.reply("The person that youre trying to kick, is at the same administrator level as you!");
            let embed = new Discord.MessageEmbed()
            .setTitle(`Kick`)
            .setFields(
                {name: "User that got kicked", value: `${user.tag}`},
                {name: "Reason", value: "" + reason}
            )
            .setThumbnail(user.displayAvatarURL({dynamic : true}) + '?size=4096')
            .setTimestamp(Date.now())
            .setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL()}`);
            message.channel.send({content: ` `, embeds:[embed]});
            member.kick({reason: reason})
            }
            else {
                message.reply("I dont have sufficient permissions.")
            }
           } else {
            message.reply("You dont have sufficient permissions!");
          }  
    }
    else if (command === "avatar") {
        let user = message.mentions.users.first() || message.author;
        let member = message.guild.members.cache.get(user.id)
        let embed = new Discord.MessageEmbed()
        .setTitle(`*${member.displayName}` + "'s avatar!*")
        .setImage(member.displayAvatarURL({dynamic: true}) + '?size=4096')
        .setColor('RANDOM')
        .setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL()}`)
        .setTimestamp(Date.now());
        message.channel.send({content: ` `, embeds:[embed]});
    }
    else if (command === "afk") {
        let reason = message.content.slice((prefix + command).length)
        if (!reason) {
            reason = "non-reasoned."
        }
        let user = message.author;
        let member = message.guild.members.cache.get(user.id)
        afkUsers.push(user.id)
        message.reply("You're AFK, your reason: " + reason + "");
    }
    else if (command === "duel") {
        const results = ["Kicks her/him in the stomach.", "Breaks his/her rig cages.", "Beats you up with a shield.", "Punches him/her in the face", "Whoops your ass.", "Punches him/her in the face", "Elbows him/her face", "Slashes you with an sword"]
        const duellers = []

        let member = message.mentions.users.first();
        if (!member) return message.reply("You cant duel with air.")
        if (member === message.author) return message.reply("You cant duel with yourself.")
        let user = message.guild.members.cache.get(member.id);
        let author = message.guild.members.cache.get(message.author.id)
        duellers.push(user.displayName, author.displayName);
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(
            './wallpaper.jpg'
        )
        let x = 0
        let y = 0
        context.drawImage(background, x, y)
        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({format: 'jpg'}));
        x = canvas.width / 2 - avatar.width / 2
        y = canvas.height / 2 - avatar.height / 2
        context.drawImage(avatar, x-200, y)
        const avatar2 = await Canvas.loadImage(member.displayAvatarURL({format: 'jpg'}));
        x = canvas.width / 2 - avatar2.width / 2
        y = canvas.height / 2 - avatar2.height / 2
        context.drawImage(avatar2, x+200, y)
        context.fillStyle = '#ffffff'
        context.font = '35px sans-serif'
        let text = "VERSUS"
        x = canvas.width / 2 - context.measureText(text).width / 2
        context.fillText(text, x, 60 + avatar.height - 40)
        console.log(duellers)
        player1hp = 100;
        player2hp = 100;
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'duel-background.png');
        const embed = new Discord.MessageEmbed()
        .setTitle(`Duel between: ${author.displayName} and` + ` ${user.displayName}`)
        .setDescription(`**${author.displayName}'s** health point: **` + player1hp + `**  - **${user.displayName}'s** health point: **` + player2hp + `**`)
        .addFields(
            {name: `${author.displayName}'s attacks`, value: `` + results[Math.floor(Math.random() * results.length)] + ` (∩•̀ω•́)⊃-⋆`},
            {name: `${user.displayName}'s attacks`, value:`` + results[Math.floor(Math.random() * results.length)] + ` (∩•̀ω•́)⊃-⋆`}
        )
        .setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL()}`)
        .setTimestamp(Date.now());
        const msgRef = await message.channel.send({content: ` `, files:[attachment], embeds:[embed]});
        while (player1hp > 0 && player2hp > 0) {
            player1hp = player1hp - Math.floor(Math.random() * 16)
            player2hp = player2hp - Math.floor(Math.random() * 16)
            const results = ["Kicks her/him in the stomach.", "Breaks his/her rig cages.", "Beats you up with a shield.", "Punches him/her in the face", "Whoops your ass.", "Punches him/her in the face", "Elbows him/her face", "Slashes you with an sword"]
            const newEmbed = new Discord.MessageEmbed()
            .setTitle(`Duel between: ${author.displayName} and` + ` ${user.displayName}`)
            .setDescription(`**${author.displayName}'s** health point: **` + player1hp + `**  - **${user.displayName}'s** health point: **` + player2hp + `**`)
            .addFields(
                {name: `${author.displayName}'s attacks`, value: `` + results[Math.floor(Math.random() * results.length)] + ` (∩•̀ω•́)⊃-⋆`},
                {name: `${user.displayName}'s attacks`, value:`` + results[Math.floor(Math.random() * results.length)] + ` (∩•̀ω•́)⊃-⋆`}
            )
            .setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL()}`)
            .setTimestamp(Date.now());
            msgRef.edit({content:` `, embeds:[newEmbed]})
            if (player1hp && player2hp <= 0) {
                msgRef.edit({content: `Draw, no one won.`, embeds:[newEmbed]})
            }
            if (player1hp <= 0) {
                msgRef.edit({content: `${author.toString()}, lost. ${user.toString()} won!`, embeds:[newEmbed]})
            }
            if (player2hp <= 0) {
                msgRef.edit({content: `${user.toString()}, lost. ${author.toString()} won!`, embeds:[newEmbed]})
            }
        }
     }
});
  


bot.on('ready', () => {
    console.log(`Bot ${bot.user.tag} is logged in!`);
    bot.user.setPresence({
        activities: [{
            name: 'm.help',
            type: "PLAYING"
        }],
        status: "idle"
    })
});



