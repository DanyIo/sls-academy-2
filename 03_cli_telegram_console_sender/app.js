const { Command } = require("commander");
const program = new Command();
const TelegramBot = require("node-telegram-bot-api");

process.env["NTBA_FIX_350"] = 1;

const BOT_TOKEN = "6232514296:AAF1N8vpcb5sMyRdXLCccZ0fW10fo8Lb_vA"; // replace with yours
let CHAT_ID = 458551725; // replace with yours

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

program
  .name("app")
  .description("Communication with telegram bot")
  .version("0.8.0");

program
  .command("m <message>")
  .alias("message")
  .description("Send message to telegram bot")
  .action(async (message, options) => {
    try {
      await bot.sendMessage(CHAT_ID, message);
      console.log("Message sent successfully");
      process.exit(0);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

program
  .command("p <path>")
  .alias("photo")
  .description("Send photo to telegram bot")
  .action(async (photoPath, options) => {
    try {
      await bot.sendPhoto(CHAT_ID, photoPath);
      console.log("Photo sent successfully");
      process.exit(0);
    } catch (error) {
      console.error("Error sending photo:", error);
    }
  });

program.parse();
