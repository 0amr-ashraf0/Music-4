const Discord = require('discord.js')
const ytdl = require("ytdl-core");
const { Client, Util } = require('discord.js');
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const queue = new Map();
const client = new Discord.Client();
const client2 = new Discord.Client();

 
client.on('ready', function(){
 console.log(`Logged in as ${client.user.tag}!`);
client.user.setStatus("dnd");
client.on('ready', function(){    
    var ms = 5000 ;    
    var setGame = ["Pro Music",`By ! M.C , 𝕄𝕒𝕥𝕣𝕖𝕩.☂#9231`,"-->Mero Codes<--",`Type 3help`];    
    var i = -1;    
    var j = 0;    
    setInterval(function (){    
        if( i == -1 ){    
j = 1;    
       }    
        if( i == (setGame.length)-1 ){    
            j = -1;    
      }    
       i = i+j;    
        client.user.setGame(setGame[i],`http://twitch.tv/matrex`);    
}, ms);    
    
});
const devs = ["484869429327560704"];
const prefix = "3"
client.on('message', async msg => {
    if (msg.author.bot) return undefined;
  if (!devs.includes(msg.author.id)) return;
    if (!msg.content.startsWith(prefix)) return undefined;
    const args = msg.content.split(' ');

    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1] .replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);
    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length)
    if (command === `play`) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('يجب توآجد حضرتك بروم صوتي .').then(message =>{message.delete(2000)})
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم').then(message =>{message.delete(2000)})
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم').then(message =>{message.delete(2000)})
        }
 
       
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, msg, voiceChannel, true);
            }
            return msg.channel.send(` **${playlist.title}** تم الإضآفة إلى قأئمة التشغيل`).then(message =>{message.delete(2000)})
        } else {
            try {
 
                var video = await youtube.getVideo(url);
 
            } catch (error) {
                try {
                                            var fast = {};
                    var videos = await youtube.searchVideos(searchString, 5);
                    let index = 0;
                   
                    msg.channel.send(`**
${videos.map(video2 => `[\`${++index}\`]${video2.title}`).join('\n')}**`).then(message =>{
 
                        message.delete(15000)
 
 
                    });
                    try {
                        var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 5, {
                            maxMatches: 1,
                            time: 20000,
                            errors: ['time']
                        })
 
                        }catch(err) {
                        console.error(err);
                        return msg.channel.send('لم يتم إختيآر مقطع صوتي').then(message =>{message.delete(2000)})
                        }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send(':x: لا يتوفر نتآئج بحث ').then(message =>{message.delete(2000)})
                }
        }
 
            return handleVideo(video, msg, voiceChannel);
        }
    } else if (command === `skip`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .').then(message =>{message.delete(2000)})
        if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لتجآوزه').then(message =>{message.delete(2000)})
        serverQueue.connection.dispatcher.end('تم تجآوز هذآ المقطع').then(message =>{message.delete(2000)})
        return undefined;
    } else if (command === `stop`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .').then(message =>{message.delete(2000)})
        if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لإيقآفه');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('تم إيقآف هذآ المقطع').then(message =>{message.delete(2000)})
        return undefined;
    } else if (command === `vol`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .').then(message =>{message.delete(2000)})
        if (!serverQueue) return msg.channel.send('لا يوجد شيء شغآل.').then(message =>{message.delete(2000)})
        if (!args[1]) return msg.channel.send(`:loud_sound: مستوى الصوت **${serverQueue.volume}**`).then(message =>{message.delete(2000)})
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
        return msg.channel.send(`:speaker: تم تغير الصوت الي **${args[1]}**`).then(message =>{message.delete(2000)})
    } else if (command === `np`) {
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
        const embedNP = new Discord.RichEmbed()
    .setDescription(`:notes: الان يتم تشغيل : **${serverQueue.songs[0].title}**`).then(message =>{message.delete(2000)})
        return msg.channel.sendEmbed(embedNP);
    } else if (command === `replay`) {
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
        const embedNP = new Discord.RichEmbed()
    .setDescription(`سيتم اعاده تشغيل الفديو :**${serverQueue.songs[0].title}**`)
    msg.channel.send({embed: embedNP})
     return handleVideo(video, msg, msg.member.voiceChannel);
 
    } else if (command === `queue`) {
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
        let index = 0;
        const embedqu = new Discord.RichEmbed()
.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**الان يتم تشغيل** ${serverQueue.songs[0].title}`).then(message =>{message.delete(2000)})
        return msg.channel.sendEmbed(embedqu);
    } else if (command === `pause`) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send('تم إيقاف الموسيقى مؤقتا!').then(message =>{message.delete(2000)})
        }
        return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
    } else if (command === "resume") {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send('استأنفت الموسيقى بالنسبة لك !').then(message =>{message.delete(2000)})
        }
        return msg.channel.send('لا يوجد شيء حالي في العمل.').then(message =>{message.delete(2000)})
    }
 
    return undefined;
async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        time:`${video.duration.hours}:${video.duration.minutes}:${video.duration.seconds}`,
        xnx:`${video.thumbnails.high.url}`,
        best:`${video.channel.title}`,
        bees:`${video.raw.snippet.publishedAt}`,
        shahd:`${video.raw.kind}`,
        zg:`${video.raw.snippet.channelId}`,
        views:`${video.raw.views}`,
        like:`${video.raw.likeCount}`,
        dislike:`${video.raw.dislikeCount}`,
        hi:`${video.raw.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`لا أستطيع دخول هذآ الروم ${error}`).then(message =>{message.delete(2000)})
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return msg.channel.send(` **${song.title}** تم اضافه الاغنية الي القائمة!`).then(message =>{message.delete(2000)})
    }
    return undefined;
}
 
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
 
    if (!song) {
      serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        fetchVideoInfo(`${song.hi}`, function (err, fuck) {
  if (err) throw new Error(err);

      const yyyy = {}
  if(!yyyy[msg.guild.id]) yyyy[msg.guild.id] = {
    like: `${fuck.likeCount}`,
    dislike: `${fuck.dislikeCount}`
  }
    serverQueue.textChannel.send({embed : new Discord.RichEmbed()
  .setTitle(`**${fuck.title}**`)
  .setURL(fuck.url)
  .addField('Time The Video :' , `${song.time}`, true)
  .addField('Channel Name :' , `${song.best}`, true)
  .addField('Channel ID :' , `${song.zg}`, true)
  .addField('Video Created at :' , `${fuck.datePublished}`, true)
  .addField('Views :' , `${fuck.views}`, true)
  .addField('Like👍 :' , `${fuck.likeCount}`, true)
  .addField('dislike👎 :' , `${fuck.dislikeCount}`, true)
  .addField('comments :' , `${fuck.commentCount}`, true)
    .setThumbnail(`${song.xnx}`)
    .setColor('#ff0000')
    .setTimestamp()
    }).then(love => {
       
        love.delete(2000)
   
 //.then(message =>{message.delete(2000)})
  
})
})
}
});
client.on('message', message => {
if (message.content.startsWith(prefix + 'help')) { //DiamondCodes - [ X_KillerYT ]
    let pages = [`
        ***__أوامر بوت الميوزك__***
**
『3help』/لارسال رسالة المساعدة
『3play [اسم الأغنية أو الرابط]』/لتشغيل اغنية
『3skip』/لتجاوز مقطع
『3stop』/لايقاف مقطع
『3pause』/لايقاف مقطع مؤقتًا
『3np』/لاظهار الأغاني التي تم تشغيلها بواسطتك
『3vol [المستوى]』/للتحكم في مستوى الصوت
『3queue』/لاظهار الأغاني التي تم تشغيلها بواسطة الجميع
『3replay』/لاعادة تشغيل الأغنية
**`]
    let page = 1;
 
    let embed = new Discord.RichEmbed()
    .setColor('BLUE')
    .setFooter(`Page ${page} of ${pages.length}`)
    .setDescription(pages[page-1])
 
    message.author.sendEmbed(embed).then(msg => {
 
        msg.react('◀').then( r => {
            msg.react('▶')
 
 
        const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;
 
 
        const backwards = msg.createReactionCollector(backwardsFilter, { time: 2000000});
        const forwards = msg.createReactionCollector(forwardsFilter, { time: 2000000});
 
 
 
        backwards.on('collect', r => {
            if (page === 1) return;
            page--;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        forwards.on('collect', r => {
            if (page === pages.length) return;
     
      page++;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        })
    })
    }
});
client2.on('ready', function(){
 console.log(`Logged in as ${client.user.tag}!`);
client2.user.setStatus("idle");
client2.on('ready', function(){    
    var ms = 5000 ;    
    var setGame = ["Pro Music",`By ! M.C , 𝕄𝕒𝕥𝕣𝕖𝕩.☂#9231`,"-->Mero Codes<--",`Type 4help`];    
    var i = -1;    
    var j = 0;    
    setInterval(function (){    
        if( i == -1 ){    
j = 1;    
       }    
        if( i == (setGame.length)-1 ){    
            j = -1;    
      }    
       i = i+j;    
        client2.user.setGame(setGame[i],`http://twitch.tv/matrex`);    
}, ms);    
    
});
const devs = ["484869429327560704"];
const prefix = "4"
client2.on('message', async msg => {
    if (msg.author.bot) return undefined;
  if (!devs.includes(msg.author.id)) return;
    if (!msg.content.startsWith(prefix)) return undefined;
    const args = msg.content.split(' ');

    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1] .replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);
    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length)
    if (command === `play`) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('يجب توآجد حضرتك بروم صوتي .').then(message =>{message.delete(2000)})
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم').then(message =>{message.delete(2000)})
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم').then(message =>{message.delete(2000)})
        }
 
       
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, msg, voiceChannel, true);
            }
            return msg.channel.send(` **${playlist.title}** تم الإضآفة إلى قأئمة التشغيل`).then(message =>{message.delete(2000)})
        } else {
            try {
 
                var video = await youtube.getVideo(url);
 
            } catch (error) {
                try {
                                            var fast = {};
                    var videos = await youtube.searchVideos(searchString, 5);
                    let index = 0;
                   
                    msg.channel.send(`**
${videos.map(video2 => `[\`${++index}\`]${video2.title}`).join('\n')}**`).then(message =>{
 
                        message.delete(15000)
 
 
                    });
                    try {
                        var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 5, {
                            maxMatches: 1,
                            time: 20000,
                            errors: ['time']
                        })
 
                        }catch(err) {
                        console.error(err);
                        return msg.channel.send('لم يتم إختيآر مقطع صوتي').then(message =>{message.delete(2000)})
                        }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send(':x: لا يتوفر نتآئج بحث ').then(message =>{message.delete(2000)})
                }
        }
 
            return handleVideo(video, msg, voiceChannel);
        }
    } else if (command === `skip`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .').then(message =>{message.delete(2000)})
        if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لتجآوزه').then(message =>{message.delete(2000)})
        serverQueue.connection.dispatcher.end('تم تجآوز هذآ المقطع').then(message =>{message.delete(2000)})
        return undefined;
    } else if (command === `stop`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .').then(message =>{message.delete(2000)})
        if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لإيقآفه');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('تم إيقآف هذآ المقطع').then(message =>{message.delete(2000)})
        return undefined;
    } else if (command === `vol`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .').then(message =>{message.delete(2000)})
        if (!serverQueue) return msg.channel.send('لا يوجد شيء شغآل.').then(message =>{message.delete(2000)})
        if (!args[1]) return msg.channel.send(`:loud_sound: مستوى الصوت **${serverQueue.volume}**`).then(message =>{message.delete(2000)})
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
        return msg.channel.send(`:speaker: تم تغير الصوت الي **${args[1]}**`).then(message =>{message.delete(2000)})
    } else if (command === `np`) {
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
        const embedNP = new Discord.RichEmbed()
    .setDescription(`:notes: الان يتم تشغيل : **${serverQueue.songs[0].title}**`).then(message =>{message.delete(2000)})
        return msg.channel.sendEmbed(embedNP);
    } else if (command === `replay`) {
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
        const embedNP = new Discord.RichEmbed()
    .setDescription(`سيتم اعاده تشغيل الفديو :**${serverQueue.songs[0].title}**`)
    msg.channel.send({embed: embedNP})
     return handleVideo(video, msg, msg.member.voiceChannel);
 
    } else if (command === `queue`) {
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
        let index = 0;
        const embedqu = new Discord.RichEmbed()
.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**الان يتم تشغيل** ${serverQueue.songs[0].title}`).then(message =>{message.delete(2000)})
        return msg.channel.sendEmbed(embedqu);
    } else if (command === `pause`) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send('تم إيقاف الموسيقى مؤقتا!').then(message =>{message.delete(2000)})
        }
        return msg.channel.send('لا يوجد شيء حالي ف العمل.').then(message =>{message.delete(2000)})
    } else if (command === "resume") {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send('استأنفت الموسيقى بالنسبة لك !').then(message =>{message.delete(2000)})
        }
        return msg.channel.send('لا يوجد شيء حالي في العمل.').then(message =>{message.delete(2000)})
    }
 
    return undefined;
async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        time:`${video.duration.hours}:${video.duration.minutes}:${video.duration.seconds}`,
        xnx:`${video.thumbnails.high.url}`,
        best:`${video.channel.title}`,
        bees:`${video.raw.snippet.publishedAt}`,
        shahd:`${video.raw.kind}`,
        zg:`${video.raw.snippet.channelId}`,
        views:`${video.raw.views}`,
        like:`${video.raw.likeCount}`,
        dislike:`${video.raw.dislikeCount}`,
        hi:`${video.raw.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`لا أستطيع دخول هذآ الروم ${error}`).then(message =>{message.delete(2000)})
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return msg.channel.send(` **${song.title}** تم اضافه الاغنية الي القائمة!`).then(message =>{message.delete(2000)})
    }
    return undefined;
}
 
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
 
    if (!song) {
      serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        fetchVideoInfo(`${song.hi}`, function (err, fuck) {
  if (err) throw new Error(err);

      const yyyy = {}
  if(!yyyy[msg.guild.id]) yyyy[msg.guild.id] = {
    like: `${fuck.likeCount}`,
    dislike: `${fuck.dislikeCount}`
  }
    serverQueue.textChannel.send({embed : new Discord.RichEmbed()
  .setTitle(`**${fuck.title}**`)
  .setURL(fuck.url)
  .addField('Time The Video :' , `${song.time}`, true)
  .addField('Channel Name :' , `${song.best}`, true)
  .addField('Channel ID :' , `${song.zg}`, true)
  .addField('Video Created at :' , `${fuck.datePublished}`, true)
  .addField('Views :' , `${fuck.views}`, true)
  .addField('Like👍 :' , `${fuck.likeCount}`, true)
  .addField('dislike👎 :' , `${fuck.dislikeCount}`, true)
  .addField('comments :' , `${fuck.commentCount}`, true)
    .setThumbnail(`${song.xnx}`)
    .setColor('#ff0000')
    .setTimestamp()
    }).then(love => {
       
        love.delete(2000)
   
 //.then(message =>{message.delete(2000)})
  
})
})
}
});
 var prefix = "4";
client2.on('message', message => {
if (message.content.startsWith(prefix + 'help')) { //DiamondCodes - [ X_KillerYT ]
    let pages = [`
        ***__أوامر بوت الميوزك__***
**
『4help』/لارسال رسالة المساعدة
『4play [اسم الأغنية أو الرابط]』/لتشغيل اغنية
『4skip』/لتجاوز مقطع
『4stop』/لايقاف مقطع
『4pause』/لايقاف مقطع مؤقتًا
『4np』/لاظهار الأغاني التي تم تشغيلها بواسطتك
『4vol [المستوى]』/للتحكم في مستوى الصوت
『4queue』/لاظهار الأغاني التي تم تشغيلها بواسطة الجميع
『4replay』/لاعادة تشغيل الأغنية
**`]
    let page = 1;
 
    let embed = new Discord.RichEmbed()
    .setColor('BLUE')
    .setFooter(`Page ${page} of ${pages.length}`)
    .setDescription(pages[page-1])
 
    message.author.sendEmbed(embed).then(msg => {
 
        msg.react('◀').then( r => {
            msg.react('▶')
 
 
        const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;
 
 
        const backwards = msg.createReactionCollector(backwardsFilter, { time: 2000000});
        const forwards = msg.createReactionCollector(forwardsFilter, { time: 2000000});
 
 
 
        backwards.on('collect', r => {
            if (page === 1) return;
            page--;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        forwards.on('collect', r => {
            if (page === pages.length) return;
     
      page++;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        })
    })
    }
});
client.login(process.env.TOKEN);
client2.login(process.env.TOKEN2);
