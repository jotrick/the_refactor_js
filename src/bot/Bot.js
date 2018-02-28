// import * as builder from "botbuilder";
// import * as teams from "botbuilder-teams";
// import * as config from "config";
// import { StripBotAtMentions } from "./middleware/StripBotAtMentions";
// import * as DefaultDialog from "./dialogs/DefaultDialog";
// import * as HelloDialog from "./dialogs/HelloDialog";

const builder = require("botbuilder");
const teams = require("botbuilder-teams");
const config = require("config");
const StripBotAtMentions = require("./middleware/StripBotAtMentions");
const DefaultDialog = require("./dialogs/DefaultDialog");
const HelloDialog = require("./dialogs/HelloDialog");

function setupBot(teamsConnector) {
    let bot = new builder.UniversalBot(teamsConnector);

    // Create storage for the bot
    let botStorage = new builder.MemoryBotStorage();

    bot.set("persistConversationData", true);
    bot.set("storage", botStorage);

    // Add middleware
    bot.use(
        // currently this middleware cannot be used because there is an error using it
        // with updating messages examples
        // builder.Middleware.sendTyping(),

        // set on "botbuilder" (after session created)
        StripBotAtMentions.StripBotAtMentions
    );

    addDialogsToBot(bot);

    return bot;
}

function addDialogsToBot(bot) {
    DefaultDialog.addDialogToBot(bot);
    HelloDialog.addDialogToBot(bot);
}

exports.setupBot = setupBot;