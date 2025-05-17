const { Telegraf } = require("telegraf");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const express = require("express");
const moment = require("moment-timezone");

const config = require("./config.json");
const lang = require("./languages/en.lang"); // Language file added

require("dotenv").config();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
global.commands = new Map();

// Auto install missing required modules from command files
function ensureModuleInstalled(moduleName) {
  try {
    require.resolve(moduleName);
  } catch (e) {
    console.log(`ðŸ“¦ Installing missing module: ${moduleName}`);
    execSync(`npm install ${moduleName} --save`, { stdio: "inherit" });
  }
}

// Load commands from /commands
fs.readdirSync("./commands").forEach(file => {
  if (file.endsWith(".js")) {
    const commandPath = path.join(__dirname, "commands", file);
    const commandContent = fs.readFileSync(commandPath, "utf-8");

    const requireRegex = /requireî€["'](.+?)["']î€/g;
    let match;
    while ((match = requireRegex.exec(commandContent)) !== null) {
      const moduleName = match[1];
      if (!moduleName.startsWith(".") && !moduleName.startsWith("/")) {
        ensureModuleInstalled(moduleName);
      }
    }

    const command = require(commandPath);
    if (command.name && command.run) {
      global.commands.set(config.prefix + command.name, command);
      console.log(`âœ… Loaded: ${command.name}`);
    }
  }
});

// /start command
bot.start((ctx) => {
  const welcomeMsg = lang.startMessage(ctx.from.first_name, config.botname, config.prefix);
  ctx.reply(welcomeMsg, { parse_mode: "Markdown" });
});

// Handle all commands
bot.on("text", async (ctx) => {
  const text = ctx.message.text || "";
  const lower = text.toLowerCase();

  let cmdName = "";
  let args = [];

  if (text.startsWith(config.prefix)) {
    [cmdName, ...args] = text.slice(config.prefix.length).trim().split(" ");
  } else {
    const firstWord = lower.split(" ")[0];
    const possibleCommand = global.commands.get(config.prefix + firstWord) || global.commands.get(firstWord);

    if (!possibleCommand?.noPrefix) return;

    cmdName = firstWord;
    args = lower.split(" ").slice(1);
  }

  const command = global.commands.get(config.prefix + cmdName) || global.commands.get(cmdName);
  if (!command) {
    if (text.startsWith(config.prefix)) {
      const wrongCommand = cmdName || "";
      return ctx.reply(`${lang.unknownCommand.replace("%1", wrongCommand)}\n${lang.helpHint}`);
    }
    return;
  }

  try {
    ctx.message.text = `${config.prefix}${cmdName} ${args.join(" ")}`.trim();
    await command.run(ctx);
  } catch (err) {
    console.error(`âŒ Error in command ${cmdName}:`, err);
    ctx.reply(lang.commandError);
  }
});

// Dummy express server for uptime (Render)
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`Bot running at ${moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")}`);
});

app.listen(PORT, () => {
  console.log(`ðŸŒ Dummy server listening on port ${PORT}`);
});

// Launch the bot
bot.launch().then(() => {
  console.log("ðŸŸ¢ Bot is running!");
});
