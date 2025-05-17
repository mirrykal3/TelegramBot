const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const ytSearch = require("yt-search");

// Cache folder setup
const downloadDir = path.join(__dirname, "../cache");
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

// File auto-delete after timeout
function deleteAfterTimeout(filePath, timeout = 10000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("File delete error:", err.message);
      });
    }
  }, timeout);
}

module.exports = {
  name: "music",
  description: "Play top YouTube song",
  category: "media",
  usage: "/music song name",
  cooldown: 5,
  hasPermission: 0,
  credits: "Mirrykal",

  run: async (ctx) => {
    const msgText = ctx.message.text || "";
    const args = msgText.split(" ").slice(1);
    const songName = args.join(" ");

    if (!songName) return ctx.reply("Gaane ka naam likho yaar!");

    try {
      const searchResults = await ytSearch(songName);
      const topVideo = searchResults.videos[0];
      if (!topVideo) return ctx.reply("Kuch nahi mila! Gaane ka naam sahi likho.");

      // Step 1: Download thumbnail
      const thumbnailUrl = topVideo.thumbnail;
      const thumbPath = path.join(downloadDir, `thumb_${Date.now()}.jpg`);
      const writer = fs.createWriteStream(thumbPath);

      const response = await axios({ url: thumbnailUrl, responseType: "stream" });
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await ctx.replyWithPhoto(
        { source: fs.createReadStream(thumbPath) },
        {
          caption: `🎵 *${topVideo.title}*\n🔗 https://www.youtube.com/watch?v=${topVideo.videoId}`,
          parse_mode: "Markdown",
        }
      );

      deleteAfterTimeout(thumbPath);

      // Step 2: Download audio from external API
      const videoUrl = `https://www.youtube.com/watch?v=${topVideo.videoId}`;
      const apiUrl = `https://mirrykal.onrender.com/download?url=${encodeURIComponent(videoUrl)}&type=audio`;

      const downloadResponse = await axios.get(apiUrl);
      const fileUrl = downloadResponse.data.file_url?.replace("http:", "https:");
      if (!fileUrl) throw new Error("Download URL missing");

      const safeTitle = topVideo.title.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${safeTitle}.mp3`;
      const audioPath = path.join(downloadDir, filename);

      const fileWriter = fs.createWriteStream(audioPath);
      await new Promise((resolve, reject) => {
        https.get(fileUrl, (res) => {
          if (res.statusCode === 200) {
            res.pipe(fileWriter);
            fileWriter.on("finish", () => fileWriter.close(resolve));
          } else {
            reject(new Error(`Audio download failed. Status: ${res.statusCode}`));
          }
        }).on("error", reject);
      });

      await ctx.replyWithAudio({ source: fs.createReadStream(audioPath), filename });
      deleteAfterTimeout(audioPath);

    } catch (err) {
      console.error("Error occurred:", err.message);
      ctx.reply("Oops! Download fail ho gaya. Thoda der baad try karo.");
    }
  }
};
