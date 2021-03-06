import {
  botCache,
  cache,
  fetchMembers,
  Role,
  sendMessage,
} from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("roles", {
  name: "members",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  botChannelPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "role", type: "role" },
  ],
  execute: async function (message, args: RolesMembersArgs, guild) {
    if (!guild) return;

    const guildMembersCached = cache.members.filter((m) =>
      m.guilds.has(message.guildID)
    );
    if (guildMembersCached.size !== guild.memberCount) {
      await fetchMembers(guild);
    }

    const texts: string[] = [];

    let botCount = 0;
    let memberCount = 0;

    for (const member of cache.members.values()) {
      if (!member.guilds.has(message.guildID)) continue;

      // If not everyone role and member doesnt have this role skip
      if (
        message.guildID !== args.role.id &&
        !member.guilds.get(message.guildID)?.roles.includes(args.role.id)
      ) {
        continue;
      }

      if (member.bot) botCount++;
      else memberCount++;

      texts.push(`<@!${member.id}> ${member.tag} [**${member.id}**]\n`);
    }

    texts.unshift(`${botCount} 🤖 | ${memberCount} 👤`);

    const responses = botCache.helpers.chunkStrings(texts);

    for (const response of responses) {
      sendMessage(
        message.channelID,
        { content: response, mentions: { parse: [] } },
      );
    }
  },
});

interface RolesMembersArgs {
  role: Role;
}
