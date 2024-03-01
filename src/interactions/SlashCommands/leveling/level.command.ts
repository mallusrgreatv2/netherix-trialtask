import { LevelingModel } from "@/schema/leveling.js";
import Command from "@/structures/Command.js";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Check your level")
    .addUserOption((user) =>
      user.setName("user").setDescription("The user to check the level of")
    ),
  async run(client, interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    await interaction.deferReply();
    let data = await LevelingModel.findOne({ userId: user.id });
    if (!data)
      data = new LevelingModel({
        userId: user.id,
      });
    await interaction.editReply(
      `Level: ${data.level}
XP: ${Math.round(data.xp)}
Needed XP: ${data.totalXpNeeded}
Percentage of advancement: ${Math.round((data.xp / data.totalXpNeeded) * 100)}%`
    );
  },
});
