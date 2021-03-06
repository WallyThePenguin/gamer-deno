import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("events", {
  name: "template",
  aliases: ["t"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  cooldown: {
    seconds: 30,
  },
  arguments: [
    { name: "eventID", type: "number" },
    { name: "name", type: "string" },
  ],
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message, args: CommandArgs) {
    const event = await db.events.findOne(
      { eventID: args.eventID, guildID: message.guildID },
    );
    if (!event) return botCache.helpers.reactError(message);

    // All necessary checks complete
    db.events.update(event.id, { templateName: args.name });
    botCache.helpers.reactSuccess(message);
  },
});

interface CommandArgs {
  name: string;
  eventID: number;
}
