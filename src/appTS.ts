import * as express from "express";
import * as path from "path";
import * as config from "config";
import * as teams from "botbuilder-teams";
import * as Bot from "./bot/Bot";
import * as ComposeExtension from "./composeExtension/ComposeExtension";

let app = express();

app.set("port", process.env.PORT || 3978);
app.use(express.static(path.join(__dirname, "./tab")));
app.use(express.static(path.join(__dirname, "./composeExtension/settingsPopup")));

// Create Teams connector for the bot
let teamsConnector = new teams.TeamsChatConnector({
    appId: config.get("bot.botId"),
    appPassword: config.get("bot.botPassword"),
});

// Configure bot route
app.post("/api/messages", teamsConnector.listen());

let bot = Bot.setupBot(teamsConnector);

ComposeExtension.setupComposeExtension(teamsConnector, bot);

// Start app
app.listen(app.get("port"), function (): void {
    console.log(""); // for blank line for readability
    console.log("Express server listening on port " + app.get("port"));
    console.log(""); // for blank line for readability
    console.log("Server running successfully");
    console.log("Endpoint to register in Bot Framework:");
    console.log("/api/messages");
});
