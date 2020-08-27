import { botCache } from "../../../mod.ts";
import { translateArray } from "../../utils/i18next.ts";
import { sendResponse, createCommandAliases } from "../../utils/helpers.ts";

const quoteData = [
  { name: "advice", aliases: ["ad"], requireArgs: false },
  { name: "8ball", aliases: [`8b`, `fortune`], requireArgs: true },
];

quoteData.forEach((data) => {
  botCache.commands.set(data.name, {
    name: data.name,
    guildOnly: true,
    execute: (message, _args, guild) => {
      if (data.requireArgs) {
        if (message.content.split(" ").length < 2) {
          return sendResponse(message, `commands/${data.name}:NEED_ARGS`);
        }
      }

      const quotes = translateArray(
        message.guildID,
        `commands/${data.name}:QUOTES`,
      );
      const random = botCache.helpers.chooseRandom(quotes);
      sendResponse(message, random);

      // TODO: Mission
    },
  });

  if (data.aliases?.length) createCommandAliases(data.name, "ad");
});
