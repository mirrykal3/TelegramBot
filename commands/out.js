module.exports = {
  name: "out",
  description: "Bot group chhod deta hai (admin only)",
  category: "group",
  usage: "/out",
  hasPermission: 1,

  run: async (ctx) => {
    try {
      const member = await ctx.getChatMember(ctx.from.id);
      if (member.status !== "administrator" && member.status !== "creator") {
        return ctx.reply("❌ Sirf group admin hi bot ko nikal sakta hai.");
      }

      await ctx.reply("Ok, main jaa raha hoon...");
      await ctx.leaveChat();
    } catch (err) {
      console.error("Leave error:", err.message);
      ctx.reply("⚠️ Main group se nahi jaa paaya.");
    }
  }
};
