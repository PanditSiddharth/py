// import files from project
import keep_alive from './keep_alive'
import fs from 'fs';
import bt from './bot';
// import Hlp from './helpers';
import config from './config'
// import real from "./help/real"
// 2 global dependencies
import { Scenes, session, Telegraf } from "telegraf";
console.log('hi')
// importig all starters file which is starting point after this file
import pyStarter from './pystarter'

let obj:any = {};
// this will run web server and always make it alive
keep_alive(obj)

// env variable 
require('dotenv').config()

// Helper class object where sleep function etc listed
// let h = new Hlp()

// for entering and leaving Scene
const { enter, leave } = Scenes.Stage;

// global object for all updates
let func: any = {};

// Helper function which replace bot username if exists in command
function cmdd(ctx: any) {
  ctx.message.text = ctx.message.text.replace(new RegExp("^\\" + config.startSymbol + "[a-zA-Z0-9]{2,9}@" + ctx.botInfo.username, 'i'),
    (match: any) => match.replace("@" + ctx.botInfo.username, ""))
}

// All scenes 
let pyScene = new Scenes.BaseScene<Scenes.SceneContext>("py");
pyScene.enter(async (ctx: any) => {
  cmdd(ctx);
  await pyStarter(bot, ctx)
});

pyScene.on("message", async (ctx: any) => {
  cmdd(ctx);
  await pyStarter(bot, ctx)
});

// making instance of Telegraf class
let bot = new Telegraf<Scenes.SceneContext>(config.token);

// regestering all scenes
let stage = new Scenes.Stage<Scenes.SceneContext>([pyScene], { ttl: config.ttl });

// passing bot instance in bot.ts file by call those function
bt(bot);
// real(bot as any);

// Some global telegraf uses for help
bot.use(session());
bot.use(stage.middleware());

// Main Program starts from here it listens /js /py all commands and codes 
bot.hears(new RegExp("^\\" + config.startSymbol + "(py|python)|\\/start", "i"), async (ctx: any) => {
  try {

    let compiler: any = ctx.message.text + "";
    let memb = await ctx.getChatMember(ctx.botInfo.id)
    if (!memb.can_delete_messages) {
      if ((ctx.chat.id + "").startsWith("-100"))
        return ctx.reply('I must be admin with delete message permission')
    }

    function cmp(a: string) {
      return (new RegExp("^\\" + config.startSymbol + a, "i")).test(compiler)
    }

    if(compiler.startsWith("/start")){
   if (obj.hasOwnProperty("" + ctx.message.from.id)) {
      let kkk:any = obj["" + ctx.message.from.id]
      ctx.message.text = config.startSymbol + "py " + kkk.text;
      return ctx.scene.enter("py")
    }else {
     ctx.reply('its not valid for you\nPlease run your own code of python\n\nSee help by writting @help').catch((er: any) => { })
    }
    return}
    
    if (cmp("py|python"))
      ctx.scene.enter("py")
  } catch (error) {
  }
})

// launching bot in polling mode
bot.launch({ dropPendingUpdates: true });