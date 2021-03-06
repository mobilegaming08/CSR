const Discord=require('discord.js');
const {staff}=require('./stafflist.json')
function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   }

module.exports = {
    name: 'join',
    alias:['joins'],
    description: 'sends a join request to a server',
   async execute(message, args) {
       
        let ed=new Discord.RichEmbed()
        .setColor(rgbToHex(138,0,138))
         let sv=message.client.guilds.find(x=>x.name.toLowerCase().indexOf(args.join(' ').toLowerCase())!=-1)
    if(sv){
        let ch=sv.channels.find(x=>x.name==='irc')
        if (ch){
            message.author.send(`awaiting aproval from ${sv.name}...`)
            let rq=await sv.createChannel('irc request','text')
            rq.overwritePermissions(sv.id,{'VIEW_CHANNEL':false})
            sv.roles.forEach(role => {
                if(role.hasPermission("KICK_MEMBERS")){
                    rq.overwritePermissions(role.id,{'VIEW_CHANNEL':true})
                }
            });

            ed.setAuthor(`user ${message.author.username} is requesting an invite`,icon=(message.author.avatarURL||message.author.defaultAvatarURL))
            ed.addField(name=`Tag`,value=`${message.author.tag}`,inline=false)
            ed.addField('server:',sv.name,false)
            //ed.addField('role in server',message.author.roles.first().name)
             
            let perm=await rq.send(RichEmbed=ed)
            await perm.react('✅')
            await perm.react('❎')
                let filter=(reaction,user)=>(reaction.emoji.name==='✅'||reaction.emoji.name==='❎')&&!user.bot
            let cll=perm.createReactionCollector(filter,{time:60000})
                
           // console.log(kl)
           // let filter=(reaction,user)=>(reaction.emoji.name==='✅'||reaction.emoji.name==='❎')&&!user.bot  
           // let cll=kl.createReactionCollector(filter,{time:20000})
        
            cll.on('collect',(rec)=>{
                if(rec.emoji.name=='❎'){
                   // sv.owner.send('sending refusal')
                    message.author.send('denied permission')
                    rq.delete()
                    cll.stop()
                }
                if(rec.emoji.name=='✅'){

                    ch.createInvite('someone requested to join this server')
            .then((invite)=>{
                message.author.send(`${sv.name}\'s invite code:${invite.url}`)
                
            })
            .catch((err)=>{
                console.log(err)
            });
            rq.delete()
            cll.stop()
            }
            
            })
           // sv.owner.send(RichEmbed=ed)
          cll.on('end',(t)=>{
            if(!t.size>0){
                
                message.author.send('no response try again later')
                rq.delete()
            }
          })

    
          
    }
    
    }
    else{
        message.author.send(`could not find the desired server, either try a more/less precise search or it maybe just doesnt exist`)
    }
    },
};