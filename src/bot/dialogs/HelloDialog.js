// import * as builder from "botbuilder";

const builder = require("botbuilder");

function step1(session, args, next) {
    session.send("Hello");
    session.send(JSON.stringify(session.message));
    session.endDialog();
}

function addDialogToBot(bot) {
    // Do we need this abstraction? Does it actually help readability?
    let dialogId = "HelloDialog";
    let dialogSteps = [ step1 ];
    let dialogMatches = [
        /hi/i,
        /hello/i,
    ];

    // Matches can be: RegExp | RegExp[] | string | string[]
    bot.dialog(dialogId, dialogSteps)
        .triggerAction({
            matches: dialogMatches,
        });
}

exports.addDialogToBot = addDialogToBot;