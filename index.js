const discord = require("discord.js");
const config = require("./config.json")
const bot = new discord.Client({disableEveryone: true});
const fs = require("fs");
const ms = require("ms");
const sqlite = require("sqlite3").verbose();
const { GiveawaysManager } = require('discord-giveaways');
const { parse } = require("path");
var notag = ['<@325090475839324161>', '<@!325090475839324161>', '<@287825136000696320>', '<@!287825136000696320>', '<@712906442817929319>', '<@!712906442817929319>', '<@287731969243086848>', '<@!287731969243086848>']

bot.on("ready", async () => {
    console.log(`${bot.user.username} is ready for action!`);
    bot.user.setActivity('over trypvp', { type: 'WATCHING' });
    let db = new sqlite.Database('./punishment.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
    db.run(`CREATE TABLE IF NOT EXISTS data(userid INTEGER NOT NULL, username TEXT NOT NULL, pastpunishments INTEGER NOT NULL, mutes INTEGER NOT NULL, bans INTEGER NOT NULL, warns INTEGER NOT NULL, staffpunishments INTEGER NOT NULL)`);
});
function attachIsImage(msgAttach) {
    var url = msgAttach.url;
    const { member, mentions } = message
    if (member.hasPermission("ADMINISTRATOR")) return;
    return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
}
bot.giveawaysManager = new GiveawaysManager(bot, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ ],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

bot.on("message", async message => {
    let db = new sqlite.Database('./punishment.db', sqlite.OPEN_READWRITE);
    var noWords = JSON.parse(fs.readFileSync("./words/blockedWords.json"));
    var msg = message.content.toLowerCase();
    const { member, mentions } = message
    logschannel = bot.channels.cache.get("693371254207414312");
    for (let i = 0; i < noWords["blockedWords"].length; i++) {
        if (msg.includes(noWords["blockedWords"] [i])) {
            if(!member.hasPermission('ADMINISTRATOR')) {
                if (!message.channel.id === `771551289921896448` || !message.channel.id === `771551327574032394`) {
                    message.delete()
                    logschannel.send({embed: {
                        title: `Filtered message`,
                        color: `1eff00`,
                        description: `<@${member.id}> has had a message filtered. Message: ${msg}`
                    }})
                    return message.channel.send(`You aren't allowed to say that.`);
                } else {
                    console.log("someone is a bad boy and said a no no word. good thing they were in nsfw channel or I warn them.")
                }
            }
        }
    }
    var noWords = JSON.parse(fs.readFileSync("./words/blockedWords.json"));
    var msg = message.content.toLowerCase();
    for (let i = 0; i < noWords["noTag"].length; i++) {
        if (msg.includes(noWords["noTag"] [i])) {
            if(!member.hasPermission('ADMINISTRATOR')) {
                message.channel.send("Please do not ping admins or devs with the no tag role, or you will be muted.");
            }
        }
    }

    if (message.attachments.size > 0) {
        if (!message.attachments.every(attachIsImage)) {
            message.channel.send("The only image types allowed are png files. Please do not attempt to send any other attachments")
            message.delete()
        }
    }
    var noWords = JSON.parse(fs.readFileSync("./words/blockedWords.json"));
    var msg = message.content.toLowerCase();
    for (let i = 0; i < noWords["ballisticEyes"].length; i++) {
        if (msg.includes(noWords["ballisticEyes"] [i])) {
            return message.channel.send(`i gotchu in my sights`);
        }
    }
    var noWords = JSON.parse(fs.readFileSync("./words/blockedWords.json"));
    var msg = message.content.toLowerCase();
    for (let i = 0; i < noWords["ballisticTada"].length; i++) {
        if (msg.includes(noWords["ballisticTada"] [i])) {
            return message.channel.send(`is there a party i'm mising?`);
        }
    }
    if (message.author.bot) return;
    if (message.channel.type === "dm") {
        let author = message.author
        channel = bot.channels.cache.get("765331696252878858");
        message.channel.send("Okay!")
        return channel.send({embed: {
            description: `${author} just DMed the bot. Message: ${message.content}`
        }});   
    }
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if (cmd === `${prefix}help`) {
        message.channel.send({embed: {
            title: `Help:`,
            description: `Commands:
${prefix}ban [Mention user] [Severity (1-4)] [Reason] - Bans the user
${prefix}mute [Mention user] [Severity (1-4)] [Reason] - Mutes the user
${prefix}warn [Mention user] [Reason] - Warns the user
${prefix}announce [Message] - Sends an announcement
${prefix}mentionrole [Role] - Mentions a notify role
${prefix}unmute [Mention user] - Unmutes a player
${prefix}ping - Checks the bots ping
${prefix}clear [Amount] - Clears the specific amount`,
            color: `1eff00`
        }});
    }

    if(cmd === `${prefix}testdatabase`) {
        let user = message.mentions.members.first();
        let query = `SELECT * FROM data WHERE userid = ?`;
        db.get(query, [user.id], (err, row) => {
            if(err) {
                console.log(err);
                return;
            }
            if(row === undefined) {
                let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?,?,?,?,?)`);
                insertdata.run(user.id, user.tag, "0", "0", "0", "0", "0");
                insertdata.finalize();
                db.close();
                return;
            } else {
                let userid2 = row.userid
                let username = row.username;
                console.log(username)
            }
        })
    }
    if(cmd === `${prefix}fakewarns`) {
        const { member, mentions } = message
        let user = message.mentions.members.first();
        let query = `SELECT * FROM data WHERE userid = ?`;
        db.get(query, [user.id], (err, row) => {
            if(err) {
                console.log(err);
                return;
            }
            if(row === undefined) {
                let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?,?,?,?,?)`);
                insertdata.run(user.id, user.tag, "0", "0", "0", "0", "0");
                insertdata.finalize();
                db.close();
            } else {
                let userid2 = row.userid
                let username = row.username;
                console.log(username)
            }
            let userid = message.author.id;
            let userwarns = row.warns;
            let userstats = row.pastpunishments;
            var howmanya = parseInt(userwarns);
            var howmany2a = parseInt(userstats);
            var howmanyb = parseInt(args[1]);
            let howmany = howmanya + howmanyb;
            let howmany2 = howmany2a + howmanyb;
            db.run(`UPDATE data SET pastpunishments = ? WHERE userid = ?`, [howmany2, user.id])
            db.run(`UPDATE data SET warns = ? WHERE userid = ?`, [howmany, user.id])
            message.channel.send(`Added <@${user.id}>'s punishments (warns) to ${args[1]}`)
        })
    }
    if(cmd === `${prefix}fakebans`) {
        const { member, mentions } = message
        let user = message.mentions.members.first();
        let query = `SELECT * FROM data WHERE userid = ?`;
        db.get(query, [user.id], (err, row) => {
            if(err) {
                console.log(err);
                return;
            }
            if(row === undefined) {
                let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?,?,?,?,?)`);
                insertdata.run(user.id, user.tag, "0", "0", "0", "0", "0");
                insertdata.finalize();
                db.close();
            } else {
                let userid2 = row.userid
                let username = row.username;
                console.log(username)
            }
            let userid = message.author.id;
            let userbans = row.bans;
            let userstats = row.pastpunishments;
            var howmanya = parseInt(userbans);
            var howmany2a = parseInt(userstats);
            var howmanyb = parseInt(args[1]);
            let howmany = howmanya + howmanyb;
            let howmany2 = howmany2a + howmanyb;
            db.run(`UPDATE data SET pastpunishments = ? WHERE userid = ?`, [howmany2, user.id])
            db.run(`UPDATE data SET bans = ? WHERE userid = ?`, [howmany, user.id])
            message.channel.send(`Added <@${user.id}>'s punishments (bans) to ${args[1]}`)
        })
    }
    if(cmd === `${prefix}fakemutes`) {
        const { member, mentions } = message
        let user = message.mentions.members.first();
        let query = `SELECT * FROM data WHERE userid = ?`;
        db.get(query, [user.id], (err, row) => {
            if(err) {
                console.log(err);
                return;
            }
            if(row === undefined) {
                let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?,?,?,?,?)`);
                insertdata.run(user.id, user.tag, "0", "0", "0", "0", "0");
                insertdata.finalize();
                db.close();
            } else {
                let userid2 = row.userid
                let username = row.username;
                console.log(username)
            }
            let userid = message.author.id;
            let usermutes = row.mutes;
            let userstats = row.pastpunishments;
            var howmanya = parseInt(usermutes);
            var howmany2a = parseInt(userstats);
            var howmanyb = parseInt(args[1]);
            let howmany = howmanya + howmanyb;
            let howmany2 = howmany2a + howmanyb;
            db.run(`UPDATE data SET pastpunishments = ? WHERE userid = ?`, [howmany2, message.author.id])
            db.run(`UPDATE data SET mutes = ? WHERE userid = ?`, [howmany, message.author.id])
            message.channel.send(`Added <@${user.id}>'s punishments (mutes) to ${args[1]}`)
        })
    }
    if(cmd === `${prefix}fakestaffhist`) {
        const { member, mentions } = message
        let user = message.mentions.members.first();
        let query = `SELECT * FROM data WHERE userid = ?`;
        db.get(query, [user.id], (err, row) => {
            if(err) {
                console.log(err);
                return;
            }
            if(row === undefined) {
                let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?,?,?,?,?)`);
                insertdata.run(user.id, user.tag, "0", "0", "0", "0", "0");
                insertdata.finalize();
                db.close();
            } else {
                let userid2 = row.userid
                let username = row.username;
                console.log(username)
            }
            let userid = message.author.id;
            let staffpunishs = row.staffpunishments;
            var howmanya = parseInt(staffpunishs);
            var howmanyb = parseInt(args[1]);
            let howmany = howmanya + howmanyb;
            db.run(`UPDATE data SET staffpunishmnets = ? WHERE userid = ?`, [howmany, message.author.id])
            message.channel.send(`Added <@${user.id}>'s punishments (staff) to ${args[1]}`)
        })
    }
    if(cmd === `${prefix}history`) {
        const { member, mentions } = message
        let user = message.mentions.members.first();
        let query = `SELECT * FROM data WHERE userid = ?`;
        db.get(query, [user.id], (err, row) => {
            if(err) {
                console.log(err);
                return;
            }
            if(row === undefined) {
                message.channel.send("No history to view!")
                return;
            } else {
                let userpunishments = row.pastpunishments;
                let usermutes = row.mutes;
                let userbans = row.bans;
                let userwarns = row.warns;
                let staffhistory = row.staffpunishments;
                message.channel.send({embed: {
                    description: `User <@${user.id}> has ${userpunishments} punishment(s).
Mutes: ${usermutes}
Bans: ${userbans}
Warns: ${userwarns}
Staff History: ${staffhistory}`
                }})
            }
        })
    }
    if(cmd === `${prefix}ticket`) {
        const { member, mentions } = message
        message.channel.send("TryPvP Tickets | Coming soon :eyes:")
    }
    if(cmd === `${prefix}giveaway`) {
        const { member, mentions } = message
        if(
            member.hasPermission("ADMINISTRATOR") ||
            member.hasPermission("BAN_MEMBERS")
        ) {
            bot.giveawaysManager.start(message.channel, {
                time: ms(args[0]),
                prize: args.slice(2).join(" "),
                winnerCount: parseInt(args[1]),
                messages: {
                    giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
                    giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
                    timeRemaining: "Time remaining: **{duration}**!",
                    inviteToParticipate: "React with 🎉 to participate!",
                    winMessage: "Congratulations, {winners}! You won **{prize}**!",
                    embedFooter: "Giveaways",
                    noWinner: "Giveaway cancelled, no valid participations.",
                    hostedBy: "Hosted by: {user}",
                    winners: "winner(s)",
                    endedAt: "Ended at",
                    units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                        pluralS: false
                    }
                }
                
            }).then((gData) => {
                console.log(gData); // {...} (messageid, end date and more)
            });
        }
    }
    if(cmd === `${prefix}clear`) {
        const { member, mentions } = message
        if(
            member.hasPermission("ADMINISTRATOR") ||
            member.hasPermission("KICK_MEMBERS")
        ) {
            const amount = args.join(' ');
            if(!amount) {
                message.channel.send({embed: {
                    title: `Command syntax failed!`,
                    color: `fc0303`,
                    description: `Please do ${prefix}clear (Amount)`
                }});
            } else {
                if(!isNaN(amount)) {
                    message.channel.bulkDelete(amount)
                    message.channel.send(`Deleted ${amount}!`).then(msg => msg.delete({ timeout: 5000 })).catch();
                } else {
                    message.channel.send({embed: {
                        title: `Command syntax failed!`,
                        color: `fc0303`,
                        description: `Please do ${prefix}clear (Amount)`
                    }});
                }
            }
        }
    }

    if (cmd === `${prefix}ping`) {
        const { member, mentions } = message
        if (member.hasPermission("ADMINISTRATOR")) {
            message.channel.send({embed: {
                title: `Bot latency/ping`,
                description: `Latency is ${Date.now() - message.createdTimestamp}ms
API Latency is ${Math.round(bot.ws.ping)}ms.`
            }})
        }
    }

    if (cmd === `${prefix}announce`) {
        const { member, mentions } = message
        if (member.hasPermission('ADMINISTRATOR')) {
            const reason = args.slice(0).join(" ")
            channel = bot.channels.cache.get("693367255412506625");
            if (!reason) {
                return message.channel.send({embed: {
                    title: `Command syntax failed!`,
                    color: `fc0303`,
                    description: `Please do ${prefix}announce (announcement)`
                }});
            } else {
                channel.send({embed: {
                    title: `:tada: Announcement :tada:`,
                    color: `1eff00`,
                    description: `${reason}`,
                    footer: {
                        text: `Sent by ${member.user.tag}`
                    }
                }});
            }
        } else {
            message.channel.send({embed: {
                title: `Permission error`,
                color: `fc0303`,
                description: `<@${member.id}>, you do not have permission to preform ${prefix}announce. If this is in error, please contact <@325090475839324161> (The bot developer).`
            }}); 
        }
    }

    if (cmd === `${prefix}mentionrole`) {
        const { member, mentions } = message

        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('BAN_MEMBERS')
        ) {

            if(
                args[0] == `Events` ||
                args[0] == `Trainees` ||
                args[0] == `Discord` ||
                args[0] == `Java` ||
                args[0] == `Rules` ||
                args[0] == `Polls`
            ) {
                if (args[0] == `Events`) {
                    message.channel.send("<@&710370972758310973>")
                }
                if (args[0] == `Trainees`) {
                    message.channel.send("<@&702314534051774525>")
                }
                if (args[0] == `Discord`) {
                    message.channel.send("<@&702315961281413181>")
                }
                if (args[0] == `Java`) {
                    message.channel.send("<@&710371178585260082>")
                }
                if (args[0] == `Rules`) {
                    message.channel.send("<@&710371361243267122>")
                }
                if (args[0] == `Polls`) {
                    message.channel.send("<@&732665420963905607>")
                }
            } else {
                message.channel.send({embed: {
                    title: `Syntax error`,
                    color: `ff0000`,
                    description: `Please do ${prefix}mentionrole (Events, Trainees, Discord, Java, Rules, Polls)`

                }});
            }

        } else {
            return message.channel.send({embed: {
                title: `Permission error`,
                color: `fc0303`,
                description: `<@${member.id}>, you do not have permission to preform ${prefix}mentionrole. If this is in error, please contact <@325090475839324161> (The bot developer).`
            }});
        }
    }

    if (cmd === `${prefix}ban`) {
        const { member, mentions } = message

        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('BAN_MEMBERS')
        ) {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            channel = bot.channels.cache.get("724511070059757588");
            modlogschannel = bot.channels.cache.get("693371254207414312");
            if (user) {
                if(!args.slice(2).join(" ")) return message.channel.send({embed: {
                    title: `Command syntax failed!`,
                    color: `fc0303`,
                    description: `Please do ${prefix}ban (mention player or ID) (Severity 1-4) (reason)`
                }});
                if (
                    args[1] == `1` || 
                    args[1] == `2` || 
                    args[1] == `3` || 
                    args[1] == `4`
                    ) {
                        var severityColor = `1eff00`
                        var banDuration = `3600000`
                        var permBan = `false`
                        var friendlyDuration = `1 hour`
                        if (args[1] == 2) {
                            severityColor = `fffb00`
                            banDuration = `86400000`
                            friendlyDuration = `1 day`
                        }
                        if (args[1] == 3) {
                            severityColor = `ff9d00`
                            banDuration = `1209600000`
                            friendlyDuration = `2 weeks`
                        }
                        if (args[1] == 4) {
                            severityColor = `ff0000`
                            permBan = `true`
                            friendlyDuration = `Permanent`
                        }
                        const targetMember = message.guild.members.cache.get(user.id)
                        user.user.send({embed: {
                            title: `Discord Punishment`,
                            color: `${severityColor}`,
                            description: `You have been **banned** in the TryPvP Discord for ${friendlyDuration}.
        
**Reason:** ` + args.slice(2).join(" ")
                        }}).catch(() => channel.send({embed: {
                            title: `Discord Punishment`,
                            color: `${severityColor}`,
                            description: `<@${user.id}> You have been **banned** in the TryPvP Discord for ${friendlyDuration}.
        
**Reason:** ` + args.slice(2).join(" "),
                            footer: {
                                text: `For the future, please turn on your dms with the bot to ensure that you are aware of any time you receive a punishment on the discord.`
                            }
                        }}))
                        message.channel.send({embed: {
                            color: `1eff00`,
                            description: `<@${user.id}> has been successfully banned with severity ${args[1]}.`
                        }});
                        modlogschannel.send({embed: {
                            title: `Ban log`,
                            color: `1eff00`,
                            description: `<@${user.id}> was banned by <@${member.id}> for ${friendlyDuration}. 

Reason: ` + args.slice(2).join(" ")
                        }})
                        setTimeout(function() {
                            targetMember.ban({reason: args.slice(2).join(" ")})
                        }, 1000);
                        let query = `SELECT * FROM data WHERE userid = ?`;
                        db.get(query, [user.id], (err, row) => {
                            if(err) {
                                console.log(err);
                                return;
                            }
                            if(row === undefined) {
                                let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?,?,?,?,?)`);
                                insertdata.run(message.author.id, message.author.tag, "0", "0", "0", "0", "0");
                                insertdata.finalize();
                                db.close();
                            } else {
                                let userid2 = row.userid
                                let username = row.username;
                                console.log(username)
                            }
                        })
                        if (permBan == `false`) {
                            setTimeout(function() {
                                message.guild.members.unban(user.id)
                            }, banDuration);
                        }
                        
                    } else{
                        message.channel.send({embed: {
                            title: `Command syntax failed!`,
                            color: `fc0303`,
                            description: `Please do ${prefix}ban (mention player or ID) (Severity 1-4) (reason)`
                        }});
                    }
                } else {
                    return message.channel.send({embed: {
                        title: `Command syntax failed!`,
                        color: `fc0303`,
                        description: `Please do ${prefix}ban (mention player or ID) **(Severity 1-4)** (reason)`
                    }});
                }

                } else {
                    return message.channel.send({embed: {
                        title: `Permission error`,
                        color: `fc0303`,
                        description: `<@${member.id}>, you do not have permission to preform ${prefix}ban. If this is in error, please contact <@325090475839324161> (The bot developer).`
                    }});
                }
                
    }

    if (cmd === `${prefix}apply`) {
        const { member, mentions } = message
        if (
            member.hasPermission("ADMINISTRATOR") ||
            member.hasPermission("KICK_MEMBERS")
        ) {
            message.channel.send({embed: {
                title: `Want to become a staff member?`,
                color: `E74C3C`,
                description: `If you would like to become a staff member, you can apply for Trainee at https://trypvp.enjin.com/application!
Make sure you read our Trainee Training thread before applying, to make sure you fit every requirement! https://trypvp.enjin.com/forum/m/53096560/viewthread/33291711-becoming-trainee/post/139099994#p139099994`,
                footer: {
                    text: `This message was sent by a staff member`
                }
            }})
            message.delete()
        } else {
            return;
        }
    }
    if (cmd === `${prefix}rules`) {
        const { member, mentions } = message
        if (
            member.hasPermission("ADMINISTRATOR") ||
            member.hasPermission("KICK_MEMBERS")
        ) {
            message.channel.send({embed: {
                title: `Rules`,
                color: `E74C3C`,
                description: `You can find the discord server rules here: <#693318176120766544>
You can find the website and in game rules here: https://trypvp.enjin.com/rules`,
                footer: {
                    text: `This message was sent by a staff member`
                }
            }})
            message.delete()
        } else {
            return;
        }
    }

    if (cmd === `${prefix}mute`) {
        const { member, mentions } = message

        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('BAN_MEMBERS')
        ) {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            const reason = args.slice(2).join(" ")
            channel = bot.channels.cache.get("724511070059757588");
            modlogschannel = bot.channels.cache.get("693371254207414312");
            if (user) {
                if(!args.slice(2).join(" ")) return message.channel.send({embed: {
                    title: `Command syntax failed!`,
                    color: `fc0303`,
                    description: `Please do ${prefix}mute (mention player or ID) (Severity 1-4) (reason)`
                }});
                if (
                    args[1] == `1` || 
                    args[1] == `2` || 
                    args[1] == `3` || 
                    args[1] == `4`
                    ) {
                        var severityColor = `1eff00`
                        var banDuration = `3600000`
                        var permBan = `false`
                        var friendlyDuration = `1 hour`

                        let role = message.guild.roles.cache.find(r => r.name === "Muted");
                        if (!role) {
                            return message.channel.send("Couldn't find the muted role!");
                        }

                        if (args[1] == 2) {
                            severityColor = `fffb00`
                            banDuration = `86400000`
                            friendlyDuration = `1 day`
                        }
                        if (args[1] == 3) {
                            severityColor = `ff9d00`
                            banDuration = `1209600000`
                            friendlyDuration = `2 weeks`
                        }
                        if (args[1] == 4) {
                            severityColor = `ff0000`
                            permBan = `true`
                            friendlyDuration = `Permanent`
                        }
                        const targetMember = message.guild.members.cache.get(user.id)
                        user.user.send({embed: {
                            title: `Discord Punishment`,
                            color: `${severityColor}`,
                            description: `You have been **muted** in the TryPvP Discord for ${friendlyDuration}.
        
**Reason:** ` + args.slice(2).join(" ")
                        }}).catch(() => channel.send({embed: {
                            title: `Discord Punishment`,
                            color: `${severityColor}`,
                            description: `<@${user.id}> You have been **muted** in the TryPvP Discord for ${friendlyDuration}.
        
**Reason:** ` + args.slice(2).join(" "),
                            footer: {
                                text: `For the future, please turn on your dms with the bot to ensure that you are aware of any time you receive a punishment on the discord.`
                            }
                        }}))
                        setTimeout(function() {
                            message.channel.send({embed: {
                                color: `1eff00`,
                                description: `<@${user.id}> has been successfully muted with severity ${args[1]}.`
                            }});
                            modlogschannel.send({embed: {
                                title: `Mute log`,
                                color: `1eff00`,
                                description: `<@${user.id}> was muted by <@${member.id}> for ${friendlyDuration}. 
                    
Reason: ` + args.slice(2).join(" ")
                            }})
                            let query = `SELECT * FROM data WHERE userid = ?`;
                            db.get(query, [user.id], (err, row) => {
                                if(err) {
                                    console.log(err);
                                    return;
                                }
                                if(row === undefined) {
                                    let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?,?,?,?,?)`);
                                    insertdata.run(message.author.id, message.author.tag, "0", "0", "0", "0", "0");
                                    insertdata.finalize();
                                    db.close();
                                } else {
                                    let userid2 = row.userid
                                    let username = row.username;
                                    console.log(username)
                                }
                            })
                            user.roles.add(role)
                        }, 1000);
                        if (permBan == `false`) {
                            setTimeout(function() {
                                user.roles.remove(role)
                            }, banDuration);
                        }
                        
                    } else{
                        message.channel.send({embed: {
                            title: `Command syntax failed!`,
                            color: `fc0303`,
                            description: `Please do ${prefix}mute (mention player or ID) (Severity 1-4) (reason)`
                        }});
                    }
                } else {
                    return message.channel.send({embed: {
                        title: `Command syntax failed!`,
                        color: `fc0303`,
                        description: `Please do ${prefix}mute (mention player or ID) **(Severity 1-4)** (reason)`
                    }});
                }

                } else {
                    return message.channel.send({embed: {
                        title: `Permission error`,
                        color: `fc0303`,
                        description: `<@${member.id}>, you do not have permission to preform ${prefix}mute. If this is in error, please contact <@325090475839324161> (The bot developer).`
                    }});
                }
    }
    if (cmd === `${prefix}warn`) {
        const { member, mentions } = message

        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('KICK_MEMBERS')
        ) {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            const reason = args.slice(1).join(" ")
            channel = bot.channels.cache.get("724511070059757588");
            modlogschannel = bot.channels.cache.get("693371254207414312");
            if (user) {
                if(!args.slice(1).join(" ")) return message.channel.send({embed: {
                    title: `Command syntax failed!`,
                    color: `fc0303`,
                    description: `Please do ${prefix}warn (mention player or ID) (reason)`
                }});
                const targetMember = message.guild.members.cache.get(user.id)
                user.user.send({embed: {
                    title: `Discord Punishment`,
                    color: `1eff00`,
                    description: `You have been **warned** in the TryPvP Discord.

**Reason:** ` + args.slice(1).join(" ")
                }}).catch(() => channel.send({embed: {
                    title: `Discord Punishment`,
                    color: `1eff00`,
                    description: `<@${user.id}> You have been **warned** in the TryPvP Discord.

**Reason:** ` + args.slice(1).join(" "),
                    footer: {
                        text: `For the future, please turn on your dms with the bot to ensure that you are aware of any time you receive a punishment on the discord.`
                    }
                }}))
                setTimeout(function() {
                    message.channel.send({embed: {
                        color: `1eff00`,
                        description: `<@${user.id}> has been successfully warned.`
                    }});
                    modlogschannel.send({embed: {
                        title: `Warn log`,
                        color: `1eff00`,
                        description: `<@${user.id}> was warned by <@${member.id}>. 
                        
Reason: ` + args.slice(1).join(" ")
                    }})
                }, 100);
                let query = `SELECT * FROM data WHERE userid = ?`;
                db.get(query, [user.id], (err, row) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    if(row === undefined) {
                        let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?,?,?,?,?)`);
                        insertdata.run(message.author.id, message.author.tag, "0", "0", "0", "0", "0");
                        insertdata.finalize();
                        db.close();
                    } else {
                        let userid2 = row.userid
                        let username = row.username;
                        console.log(username)
                    }
                })
            } else{
                message.channel.send({embed: {
                    title: `Command syntax failed!`,
                    color: `fc0303`,
                    description: `Please do ${prefix}warn (mention player or ID) (reason)`
                }});
            }
        } else{
            return message.channel.send({embed: {
                title: `Permission error`,
                color: `fc0303`,
                description: `<@${member.id}>, you do not have permission to preform ${prefix}warn. If this is in error, please contact <@325090475839324161> (The bot developer).`
            }});
        }
    }
    if(cmd === `${prefix}unmute`) {
        const { member, mentions } = message
        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('KICK_MEMBERS')
        ) {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            modlogschannel = bot.channels.cache.get("693371254207414312");
            if(!user) return message.channel.send({embed: {
                title: `Command syntax failed!`,
                color: `fc0303`,
                description: `Please do ${prefix}unmute (mention player or ID)`
            }});
            let role = message.guild.roles.cache.find(r => r.name === "Muted");
            if (!role) {
                return message.channel.send("Couldn't find the muted role!");
            }
            user.roles.remove(role);
            message.channel.send({embed: {
                color: `1eff00`,
                description: `<@${user.id}> has been successfully unmuted.`
            }});
            modlogschannel.send({embed: {
                title: `Unmute log`,
                color: `1eff00`,
                description: `<@${user.id}> was unmuted by <@${member.id}>`
            }})
        } else{ 
            message.channel.send({embed: {
                title: `Permission error`,
                color: `fc0303`,
                description: `<@${member.id}>, you do not have permission to preform ${prefix}unmute. If this is in error, please contact <@325090475839324161> (The bot developer).`
            }});
        }
    }
    if(cmd === `${prefix}unban`) {
        const { member, mentions } = message
        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('BAN_MEMBERS')
        ) {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            modlogschannel = bot.channels.cache.get("693371254207414312");
            if(!user) return message.channel.send({embed: {
                title: `Command syntax failed!`,
                color: `fc0303`,
                description: `Please do ${prefix}unban (mention player or ID)`
            }});
            message.guild.members.unban(user.id)
            message.channel.send({embed: {
                color: `1eff00`,
                description: `<@${user.id}> has been successfully unbanned.`
            }});
            modlogschannel.send({embed: {
                title: `Unban log`,
                color: `1eff00`,
                description: `<@${user.id}> was unbanned by <@${member.id}>`
            }})
        } else{ 
            message.channel.send({embed: {
                title: `Permission error`,
                color: `fc0303`,
                description: `<@${member.id}>, you do not have permission to preform ${prefix}unban. If this is in error, please contact <@325090475839324161> (The bot developer).`
            }});
        }
    }
});
bot.login (config.token);