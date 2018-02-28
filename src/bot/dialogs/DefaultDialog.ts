import * as builder from "botbuilder";

function step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): void {
    session.send("Default");
    session.endDialog();
}

export function addDialogToBot(bot: builder.UniversalBot): void {
    // Matches can be: RegExp | RegExp[] | string | string[]
    bot.dialog("/", step1);
}
