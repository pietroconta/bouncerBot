
// Firebase App (the core Firebase SDK) is always required and must be listed first
// Browserify Setup
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics

/*import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";*/

var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');



/*var for web scraping*/

const axios = require('axios');
const cheerio = require('cheerio');

var ig = require('instagram-scraping');


//



var firebaseConfig = {
    apiKey: "AIzaSyBfBormIoabAAk6RVwpw4FnuKvm0z1vWjo",
    authDomain: "bouncerbot-f93e3.firebaseapp.com",
    projectId: "bouncerbot-f93e3",
    storageBucket: "bouncerbot-f93e3.appspot.com",
    messagingSenderId: "317709247030",
    appId: "1:317709247030:web:959dce6f1c1f03b62cee97",
    measurementId: "G-FTL0G7X4PM"
  };

firebase.initializeApp(firebaseConfig);

const Discord = require('discord.js');
const database = firebase.database();


//const admin = require('firebase-admin');
const fs = require('fs');




/*sperimental zone*/ 




//acces to insta without log in
/*axios.get('https://www.instagram.com/gmg_drm/')
    .then((response) => {
        if(response.status === 200) {
        const html = response.data;
            const $ = cheerio.load(html);
            console.log($ + html); 
    }
    }, (error) => console.log(err) );*/

//


const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

var rawdata = fs.readFileSync('config.json');
var config = JSON.parse(rawdata);

const TOKEN = config.botToken
const prefix = config.prefix
const sessionId = config.instaSession



client.once('ready', () => {
    console.log("Discord bot online")

});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.lenght).split(/ +/);
    const command = args[1].toLowerCase();


    var prefNL = command.lenght + prefix.lenght + 1;

    const userMessage = message.content.slice(prefNL).split(/ +/);
    var suffix = userMessage[2]; //number that need for establish something

    const sParameter = message.content.split("-");
    console.log(sParameter);

    var server = message.guild.id;


    //set up variable tab for bouncerBot server
    var obj = {
        settings: []
     };
  

    if(suffix != NaN)
        console.log("the subfix is " + suffix)
    

    console.log("comando eseguito: " + command)
    //Command test!
    if(command == 'cmd'){
        message.channel.send('**cmd**: \n for see the rules')
    }

    else if(command == 'cls'){

            message.channel.messages.fetch().then(messages => {
            
                message.channel.bulkDelete(messages)
            })
    }

    else if(command == 'premium')
    {
        var refPaym = firebase.database().ref('server/' + server + '/prem');

        refPaym.get().then((snapshot) => {
            
            if(snapshot.val() == true){
             message.channel.send("You'r server is upgraded")
            }

            else{
                message.channel.send("Follow this link and pay for get premium " + "https://bouncerbot.go-atcode.com/pay.php?server=" + server)

                //message.channel.send('debug info: ' + snapshot.val())
            }
            
          }).catch((error) => {
            console.error(error);
          });
    }

    else if(command == 'snd'){
        if(suffix == 'all'){


            message.guild.channels.cache.forEach( channel => {
                if(channel.type == "GUILD_TEXT") {  
                    channel.send(sParameter[1])
                 }
                });
        
            
          
            
            
        }
    }

    else if(command == 'kck'){
        let member = message.mentions.members.first();
        if(!member) return message.reply("**Error #5:** \n *Please mention a valid member of this server*");
        if(!member.kickable) return message.reply("**Error code #4: ** \n *I cannot kick this member!*");

        if(sParameter[1] != null || sParameter[1] != ''){ 
            
            member.kick(sParameter[1]) 
           
        }

        else{ 
            member.kick()
        }

        message.channel.send("**Success:** " + "<@!" + member + "> it was kicked")
    }

    else if(command == 'dlt'){

        if(isNaN(suffix)){
            var refSettings = firebase.database().ref('server/' + server + '/settings' + "/error");

            refSettings.get().then((snapshot) => {

                if(snapshot.val() == 'on')
                 message.channel.send('**Error code #2:** \n *The suffix must be a number*')
                
              }).catch((error) => {
                console.error(error);
              });
            
            return;
        }

        if(suffix <= 0 || suffix >= 100){
            var refSettings = firebase.database().ref('server/' + server + '/settings' + "/error");

            refSettings.get().then((snapshot) => {
                
                if(snapshot.val() == 'on')
                 message.channel.send('**Error code #1:** \n *The suffix must be between 1 and 100*')
                
              }).catch((error) => {
                console.error(error);
              });
            
            return;
        }


        else if(suffix == undefined){

            var refSettings = firebase.database().ref('server/' + server + '/settings' + "/error");


            refSettings.get().then((snapshot) => {
                
                if(snapshot.val() == 'on')
                 message.channel.send('**Error code #3:** \n *The suffix must exist*')
                
              }).catch((error) => {
                console.error(error);
              });

            
            return;
        }

        message.channel.messages.fetch({limit: (parseInt(suffix) + 1)}).then(messages => {
            message.channel.send('Success, i am deleting ' + suffix + ' messages...')
            message.channel.bulkDelete(messages)
        })
    }

    else if(command == 'set'){

        if(suffix == 'remove'){

            if(sParameter[1] == 'warnings'){
                firebase.database().ref('server/' + server + '/settings/warnings').set("off");

                  message.channel.send('warnings disabled successfully :ballot_box_with_check:')
            }

            else if(sParameter[1] == 'error'){
                firebase.database().ref('server/' + server + '/settings/error').set("off");

                  message.channel.send('error disabled successfully :ballot_box_with_check:')
            }

            else if(sParameter[1] == 'help'){

                helpCommand(suffix, "set remove -keyWords", "warnings, error", "remove or disable what the keyword describes")

                
            }


        }
    

        else if(suffix == 'add'){

            if(sParameter[1] == 'warnings'){
                firebase.database().ref('server/' + server + '/settings/warnings').set("on");

                  message.channel.send('warnings enabled successfully :ballot_box_with_check:')

        }

        else if(sParameter[1] == 'error'){
            firebase.database().ref('server/' + server + '/settings/error').set("on");

              message.channel.send('error enabled successfully :ballot_box_with_check:')
        }

        else if(sParameter[1] == 'help'){

            helpCommand(suffix, "set add -keyWords", "warnings, error", "add or enable what the keyword describes")

            
        }
    
    }
}

    else if(command == 'snd'){
        if(suffix == 'feed'){

            
            var textInpt = message.content.split("-")[1]
            var emailInpt = message.content.split("-")[2]
            
            console.log("request for feedback from " + userTag)
            if(emailInpt != null){

                var userTag = message.member.user.tag;
                var tagLegit = userTag.replace("#", "@");


                database.ref("feedback/" + tagLegit).set({
                    text: textInpt,
                    email: emailInpt

                });
            }
            else{
                var userTag = message.member.user.tag;
                var tagLegit = userTag.replace("#", "@");

            database.ref("feedback/" + tagLegit).set({
                text: textInpt,

            });
        }

        message.channel.send("Your feedback has been sent successfully :ballot_box_with_check: ")
        }
    }

    else if(command == 'scp'){

        if(suffix == 'insta'){

        
    axios.get('https://www.instagram.com/' + sParameter[1]  +  '/?__a=1', {

    headers: {
        Cookie: sessionId
    }
}).then(response => {
      //console.log(response);

      const html = response.data;
      const $ = cheerio.load(html); 


      //console.log(html)
      var user = html.graphql.user

      var vipSymbol = '';

      if(user.is_verified){
        vipSymbol = " ✅"
      }

      message.channel.send("**Statistic of " + "@" + sParameter[1] + vipSymbol + ":** \n" + " Follower: *" + user.edge_followed_by.count + "* \n Following: *" + user.edge_follow.count + '*\n' + " Bio: *" + user.biography
      + '*\n' + "Bio Link: *" + user.external_url + "*\nCategory: *" + user.category_name + "*\nVip: *" + user.is_verified + '*\nPrivate Account: *' + user.is_private + '*')


     
    //  const pageObject = JSON.parse(pageData)
      
      
         
});

        }

        else{
             if(getSettings('error')){
                message.channel.send('**Error code #3:** \n *The suffix must exist*')
             }


        }


           /* InstaClient.getProfileStory(sParameter[1])
            .then(profile => console.log("f " + profile))
                .catch(err => console.error("sdfsd " + err));*/

          

         

         
    }

    function helpCommand(NameCmd, cmdSyntax, keyWords, cmdDescription){

        message.channel.send("**" + NameCmd + " help: \n **" + "Command Syntax:  " + cmdSyntax + "\n" + " Key Words: " + keyWords + "\n Command Description: " + cmdDescription);
    }

     /*function getSettings(setting){

        if(setting == 'error'){
        var refSettings = firebase.database().ref('server/' + server + '/settings' + "/error");
        refSettings.on('value', (snapshot) => {
            
        if(snapshot.val() == 'on' || snapshot.val() == null)
            return true;

        else
            return false;
            
        });
        
       
    }

    else{
        console.log(setting);
    }
    return;
    }*/
    

});




client.login(TOKEN)
