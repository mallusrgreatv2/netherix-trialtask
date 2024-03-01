import Command from "@/structures/Command.js";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban people from joining your server")
    .addUserOption((user) =>
      user.setName("user").setDescription("The user to ban.").setRequired(true)
    )
    .addStringOption((reason) =>
      reason.setName("reason").setDescription("The reason to ban this user")
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  run: async (_client, interaction) => {
    if (!interaction.inCachedGuild()) return;
    const user = interaction.options.getUser("user", true);
    const reason =
      interaction.options.getString("reason") || "No reason specified";
    await interaction.deferReply();
    const authorMember = await interaction.guild.members.fetch(
      interaction.user.id
    );
    if (
      authorMember.roles.highest.comparePositionTo(
        authorMember.roles.highest
      ) <= 0 &&
      interaction.guild.ownerId !== authorMember.id
    )
      return await interaction.editReply("You cannot ban that user.");
    if (!authorMember.permissions.has("BanMembers"))
      return await interaction.editReply(
        "You need the `Ban Members` permission to use this command."
      );
    try {
      const banMember = await interaction.guild.members.fetch(user.id);
      if (!banMember.bannable) {
        return await interaction.editReply("I cannot kick that user!");
      }
    } catch (err) {}
    await interaction.guild.bans.create(user, {
      reason: `${authorMember.user.tag} banned for: ${reason}`,
    });
    await interaction.editReply({
      content: `Banned ${user.tag}\n> *${reason}*`,
      allowedMentions: {
        parse: [],
      },
    });
  },
});
