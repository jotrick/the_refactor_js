// import * as builder from "botbuilder";

const builder = require("botbuilder");

function step1(session, args, next) {
    session.send("Default");
    session.endDialog();
}

function addDialogToBot(bot) {
    // Matches can be: RegExp | RegExp[] | string | string[]
    bot.dialog("/", step1);
}

exports.addDialogToBot = addDialogToBot;