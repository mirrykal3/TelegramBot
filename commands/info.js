const axios = require("axios");
const fs = require("fs");
const https = require("https");
const path = require("path");

module.exports = {
  name: "info",
  description: "Admin and Bot Information",
  category: "info",
  usage: "/inf",
  cooldown: 2,
  hasPermission: 0,
  credits: "Arun Kumar",

  run: async (ctx) => {
    const botName = "Silly"; // Replace if dynamic
    const prefix = "/";
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const moment = require("moment-timezone");
    const timeNow = moment.tz("Asia/Kolkata").format("『D/MM/YYYY』 【HH:mm:ss】");

    const imageLinks = [
      "https://i.postimg.cc/4yVw6tm7/Picsart-23-03-26-11-08-19-025.jpg",
      "https://i.imgur.com/rg0fjQE.jpg",
      "https://i.imgur.com/QcNXYfT.jpg",
      "https://i.imgur.com/WhVSHLB.png"
    ];
    const selectedImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];

    const caption = `🌹𝙰𝙳𝙼𝙸𝙽 𝙰𝙽𝙳 𝙱𝙾𝚃 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽 🇮🇳

☄️𝗕𝗢𝗧 𝗡𝗔𝗠𝗘☄️ ⚔ ${botName} ⚔

🔥𝗢𝗪𝗡𝗘𝗥 🔥☞︎︎︎ 𝙰𝚛𝚞𝚗 𝙺𝚞𝚖𝚊𝚛 ☜︎︎︎✰

🙈🄾🅆🄽🄴🅁 🄲🄾🄽🅃🄰🄲🅃 🄻🄸🄽🄺🅂🙈➪ 
𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 🧨 https://www.facebook.com/arun.x76
𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠 👉 @arunkumar_031

✅𝗧𝗼 𝗟𝗲𝗮𝗿𝗻 𝗛𝗼𝘄 𝗧𝗼 𝗖𝗿𝗲𝗮𝘁𝗲 𝗔 𝗕𝗼𝘁 ✅ https://www.youtube.com/@mirrykal

🌸𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅🌸 ${prefix}
🥳 UPTIME: ${hours}h ${minutes}m ${seconds}s
🌪️ DATE: ${timeNow}
✅ Thanks for using my bot ❤ ${botName}`;

    const imagePath = path.join(__dirname, "cache", "info.jpg");
    const file = fs.createWriteStream(imagePath);

    https.get(selectedImage, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        ctx.replyWithPhoto({ source: imagePath }, { caption }).then(() => {
          fs.unlinkSync(imagePath);
        });
      });
    }).on("error", (err) => {
      ctx.reply("Image fetch failed, but here is the info:\n\n" + caption);
    });
  }
};
