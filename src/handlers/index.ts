import Client from "@/structures/Client.js";
import commandHandler from "./commandHandler.js";
import eventHandler from "./eventHandler.js";
export default function initHandlers(client: Client) {
  passClient(client, commandHandler, eventHandler);
}
function passClient(client: Client, ...funcs: ((client: Client) => any)[]) {
  funcs.forEach((func) => {
    func(client);
  });
}
