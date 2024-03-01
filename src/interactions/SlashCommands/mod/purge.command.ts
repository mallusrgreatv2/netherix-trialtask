import Command from "@/structures/Command.js";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete a number of messages")
    .addNumberOption((user) =>
      user
        .setName("number")
        .setDescription("The number of messages to remove.")
        .setRequired(true)
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  run: async (_client, interaction) => {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.channel) return;
    const number = interaction.options.getNumber("number", true);
    await interaction.deferReply({ ephemeral: true });
    const authorMember = await interaction.guild.members.fetch(
      interaction.user.id
    );
    if (!authorMember.permissions.has("ManageMessages"))
      return await interaction.editReply(
        "You need the `Manage Messages` permission to use this command."
      );
    const msgs = await interaction.channel.bulkDelete(number, true);
    const authors: Record<string, number> = {};
    for (const msg of msgs.values()) {
      if (!msg?.author) continue;
      if (authors[msg.author.tag]) authors[msg.author.tag]++;
      else authors[msg.author.tag] = 1;
    }

    await interaction.editReply({
      content: `Removed ${msgs.size} messages.\n\n${Object.keys(authors)
        .toSorted((a, b) => authors[a] - authors[b])
        .map((author) => `**${author}** - ${authors[author]}`)} messages`,
      allowedMentions: {
        parse: [],
      },
    });
  },
});
