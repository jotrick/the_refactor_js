import * as builder from "botbuilder";
import * as teams from "botbuilder-teams";
import * as config from "config";
import { StripBotAtMentions } from "./middleware/StripBotAtMentions";
import * as DefaultDialog from "./dialogs/DefaultDialog";
import * as HelloDialog from "./dialogs/HelloDialog";

export function setupBot(teamsConnector: teams.TeamsChatConnector): builder.UniversalBot {
    let bot = new builder.UniversalBot(teamsConnector);

    // Create storage for the bot
    let botStorage = null;

    bot.set("persistConversationData", true);
    bot.set("storage", botStorage);

    // Add middleware
    bot.use(
        // currently this middleware cannot be used because there is an error using it
        // with updating messages examples
        // builder.Middleware.sendTyping(),

        // set on "botbuilder" (after session created)
        new StripBotAtMentions(),
    );

    addDialogsToBot(bot);

    return bot;
}

function addDialogsToBot(bot: builder.UniversalBot): void {
    DefaultDialog.addDialogToBot(bot);
    HelloDialog.addDialogToBot(bot);
}
