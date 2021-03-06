import { sendMessage } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../cache.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles", {
  name: "grouped",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      literals: ["create", "delete", "add", "remove"],
    },
  ],
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message) => {
    const sets = await db.groupedrolesets.findMany(
      { guildID: message.guildID },
      true,
    );
    if (!sets?.length) return botCache.helpers.reactError(message);

    sendMessage(
      message.channelID,
      {
        content: sets.map((set) =>
          `**${set.name}**: ${set.roleIDs.map((id) => `<@&${id}>`).join(" ")}`
        ).join("\n"),
        mentions: { parse: [] },
      },
    );
  },
});
