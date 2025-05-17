const axios = require("axios");

module.exports = {
  name: "apiping",
  description: "Check API status and auto-ping every 5 minutes",
  category: "utility",
  usage: "/apiping",
  cooldown: 5,
  hasPermission: 0,
  credits: "MirryKal",

  run: async (ctx) => {
    await ctx.reply("⏳ Checking APIs, please wait...");

    const API_URLS = {
      "Silly API": "https://silly-5smc.onrender.com",
      "MirryKal API": "https://mirrykal.onrender.com",
      "Gemimi API": "https://geminiw.onrender.com",
      "Telegram-bot API": "https://telegram-bot-ouae.onrender.com"
    };

    let statusMessage = "🔥 *API Status:*\n\n";

    for (const [name, url] of Object.entries(API_URLS)) {
      try {
        await axios.get(url);
        statusMessage += `✅ ${name} is *Running*\n`;
      } catch {
        statusMessage += `❌ ${name} is *Down*\n`;
      }
    }

    ctx.reply(statusMessage, { parse_mode: "Markdown" });
  }
};

// Auto-ping every 5 minutes to keep APIs alive
const autoPingAPIs = async () => {
  const API_URLS = [
    "https://silly-5smc.onrender.com",
    "https://mirrykal.onrender.com",
    "https://geminiw.onrender.com",
    "https://telegram-bot-ouae.onrender.com"
  ];
  for (const url of API_URLS) {
    try {
      await axios.get(url);
    } catch {
      // Silently ignore failures
    }
  }
};

setInterval(autoPingAPIs, 5 * 60 * 1000);
