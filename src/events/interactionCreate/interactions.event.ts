import { GuildMember } from "discord.js";
import Event from "@/structures/Event.js";

export default new Event({
  event: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.find(
        (a) => a.data.name === interaction.commandName
      );
      if (!command) return;
      const member = interaction.guild?.members.cache.get(
        interaction.user.id
      ) as GuildMember;
      console.log(
        `${interaction.user.tag} used command ${interaction.commandName}`
      );
      try {
        await command.run(client, interaction, member);
      } catch (err) {
        if (interaction.deferred || interaction.replied) {
          try {
            await interaction.followUp("An error has occured.");
          } catch (err) {}
        } else {
          try {
            await interaction.reply("An error has occured.");
          } catch (err) {}
        }
        console.error(err);
      }
    }
    if (interaction.isAutocomplete()) {
      const command = client.commands.find(
        (a) => a.data.name === interaction.commandName
      );
      if (!command?.autocomplete) return;
      try {
        await command.autocomplete(client, interaction);
      } catch (err) {
        console.error(err);
      }
    }
  },
});
