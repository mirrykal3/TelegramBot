const fs = require("fs");
const path = require("path");
const config = require("../config.json");

module.exports = {
  name: "help",
  description: "List all commands or show info about a specific one.",
  category: "system",
  usage: `help [command]`,
  hasPermission: 0,
  cooldown: 2,
  credits: "Mirrykal",

  run: async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);
    const commandDir = path.join(__dirname);

    const files = fs.readdirSync(commandDir).filter(file => file.endsWith(".js") && file !== "help.js");

    // Agar kisi specific command ka help chahiye
    if (args.length > 0) {
      const cmdName = args[0].toLowerCase();

      for (const file of files) {
        try {
          const cmd = require(path.join(commandDir, file));
          if (cmd.name === cmdName) {
            let msg = `*Command:* ${config.prefix}${cmd.name}\n`;
            msg += `*Description:* ${cmd.description || "No description"}\n`;
            msg += `*Category:* ${cmd.category || "General"}\n`;
            msg += `*Usage:* \`${cmd.usage || "N/A"}\`\n`;
            msg += `*Cooldown:* ${cmd.cooldown || 0} sec\n`;
            msg += `*Permission:* ${cmd.hasPermission || 0}\n`;
            msg += `*Credits:* ${cmd.credits || "Unknown"}\n`;

            return ctx.replyWithMarkdown(msg);
          }
        } catch (err) {
          console.error(`❌ Failed to load ${file}:`, err.message);
        }
      }

      return ctx.reply(`Command \`${cmdName}\` not found.`);
    }

    // Agar koi specific command nahi di gayi — to sabhi commands list karo
    let msg = `*${config.botname} Command List*\n\n`;

    for (const file of files) {
      try {
        const cmd = require(path.join(commandDir, file));
        msg += `★ \`${config.prefix}${cmd.name}\`• \`${cmd.description}\`\n\n`;
      } catch (err) {
        console.error(`❌ Failed to load ${file}:`, err.message);
      }
    }

    ctx.replyWithMarkdown(msg);
  }
};
