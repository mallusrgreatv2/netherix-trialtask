import Command from "@/structures/Command.js";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick people from joining your server")
    .addUserOption((user) =>
      user.setName("user").setDescription("The user to kick.").setRequired(true)
    )
    .addStringOption((reason) =>
      reason.setName("reason").setDescription("The reason to kick this user")
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  run: async (_client, interaction) => {
    if (!interaction.inCachedGuild()) return;
    const member = interaction.options.getMember("user");
    if (!member) return await interaction.reply("That member does not exist.");
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
      return await interaction.editReply("You cannot kick that user.");
    if (!authorMember.permissions.has("KickMembers"))
      return await interaction.editReply(
        "You need the `Kick Members` permission to use this command."
      );
    try {
      const banMember = await interaction.guild.members.fetch(member.id);
      if (!banMember.kickable) {
        return await interaction.editReply("I cannot kick that user!");
      }
    } catch (err) {}
    await member.kick(`${authorMember.user.tag} kicked for: ${reason}`);
    await interaction.editReply({
      content: `Kicked ${member.user.tag}\n> *${reason}*`,
      allowedMentions: {
        parse: [],
      },
    });
  },
});
