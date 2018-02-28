import * as builder from "botbuilder";

function step1(session: builder.Session, args?: any | builder.IDialogResult<any>, next?: (args?: builder.IDialogResult<any>) => void): void {
    session.send("Hello");
    session.endDialog();
}

export function addDialogToBot(bot: builder.UniversalBot): void {
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
