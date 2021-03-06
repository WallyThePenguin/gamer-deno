import {
  bgBlue,
  bgYellow,
  black,
  cache,
  deleteMessage,
  sendMessage,
} from "../../deps.ts";
import { botCache } from "../../cache.ts";
import { Embed } from "../utils/Embed.ts";
import { getTime } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.monitors.set("autoembed", {
  name: "autoembed",
  botChannelPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
  execute: async function (message) {
    if (!botCache.autoEmbedChannelIDs.has(message.channelID)) return;

    const [attachment] = message.attachments;
    const blob = attachment
      ? await fetch(attachment.url)
        .then((res) => res.blob())
        .catch(() => undefined)
      : undefined;

    const embed = botCache.helpers.authorEmbed(message)
      .setDescription(message.content)
      .setColor("RANDOM")
      .setFooter(
        translate(message.guildID, "commands/autoembed:EMBED_ENABLED"),
      )
      .setTimestamp();
    if (blob) embed.attachFile(blob, "autoembed.png");

    sendMessage(
      message.channelID,
      { embed, file: embed.embedFile },
    );

    deleteMessage(
      message,
      translate(message.guildID, "commands/autoembed:DELETE_REASON"),
    );
    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${
        bgYellow(black("autoembed"))
      }] Executed.`,
    );
  },
});
