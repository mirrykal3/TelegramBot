// commands/goibot.js
const moment = require("moment-timezone");

module.exports = {
  name: "bot",
  description: "Sends a fun message if 'bot' is mentioned",
  category: "Fun",
  usage: "[auto reply]",
  cooldown: 5,
  permissions: 0,
  credits: "Converted by Mirrykal",

  run: async (ctx) => {
    const replies = [
      "Kya Tu ELvish Bhai Ke Aage Bolega🙄",
      "Cameraman Jaldi Focus Kro 📸",
      "Lagdi Lahore di aa🙈",
      "Ye dukh kahe nahi khatm hota 🙁",
      "you just looking like a wow😶",
      "Tum to dokebaz ho",
      "Chuppp Saatvi Fail😒",
      "Naach meri Bulbul tujhe pesa milega"
      // ...add more if you like
    ];

    const name = ctx.from.first_name || "User";
    const randomText = replies[Math.floor(Math.random() * replies.length)];

    const message = `🔶${name}🔶\n\n『\n   ${randomText} 』\n\n❤️𝙲𝚛𝚎𝚍𝚒𝚝𝚜 : 𝗠𝗶𝗿𝗿𝘆𝗸𝗮𝗹🌹`;

    // Check message text for "bot"
    if (/bot/i.test(ctx.message.text)) {
      ctx.reply(message);
    }
  }
};
