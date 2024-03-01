import { LevelingModel } from "@/schema/leveling.js";
import Event from "@/structures/Event.js";
import { Collection, MessageType } from "discord.js";
const cooldown = new Collection<string, boolean>();
export default new Event({
  event: "messageCreate",
  async run(client, message) {
    if (
      message.author.bot ||
      message.type !== MessageType.Default ||
      !message.content ||
      message.content.length <= 2 ||
      cooldown.has(message.author.id) ||
      "abcdefghijklmnopqrstuvwxyz1234567890"
        .split("")
        .every((v) => !message.content.startsWith(v))
    )
      return;
    let data = await LevelingModel.findOne({ userId: message.author.id });
    if (!data)
      data = new LevelingModel({
        userId: message.author.id,
      });
    let wordsCount = Array.from(new Set(message.content.split(/ +/g))).filter(
      (v) => !(v.length <= 1)
    ).length;
    if (wordsCount > 20) wordsCount = 20;
    data.xp += 1.55 * wordsCount + 1.22 * data.level;
    if (data.xp >= data.totalXpNeeded) {
      data.xp -= data.totalXpNeeded;
      if (data.xp > data.totalXpNeeded) data.xp = 0;
      data.level++;
      data.totalXpNeeded = data.level * 135;
      await message.reply(
        `Congratulations, you just advanced to **level ${data.level}**! ${data.totalXpNeeded} xp for level ${data.level + 1}`
      );
    }
    await data.save();
    cooldown.set(message.author.id, true);
    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, 1750);
  },
});
