import Event from "@/structures/Event.js";
export default new Event({
  event: "ready",
  run: async (c, client) => {
    c.logger.log({
      level: "info",
      message: `Bot logged in as ${client.user?.tag}`,
    });
    const commands = c.commands.map((command) => command.data.toJSON());
    await client.application.commands.set(commands);
  },
});
