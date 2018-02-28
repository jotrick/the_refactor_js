import * as builder from "botbuilder";
import * as teams from "botbuilder-teams";
import * as config from "config";

export function setupComposeExtension(teamsConnector: teams.TeamsChatConnector, bot: builder.UniversalBot): void {
    teamsConnector.onQuery("search123",
        (event: builder.IEvent, query: teams.ComposeExtensionQuery, callback: (err: Error, result: teams.IComposeExtensionResponse, statusCode: number) => void): void => {
            handleQuery(bot, event, query, callback);
        },
    );

    teamsConnector.onQuerySettingsUrl(
        (event: builder.IEvent, query: teams.ComposeExtensionQuery, callback: (err: Error, result: teams.IComposeExtensionResponse, statusCode: number) => void): void => {
            handleQuerySettingsUrl(event, query, callback);
        },
    );

    teamsConnector.onSettingsUpdate(
        (event: builder.IEvent, query: teams.ComposeExtensionQuery, callback: (err: Error, result: teams.IComposeExtensionResponse, statusCode: number) => void): void => {
            handleSettingsUpdate(bot, event, query, callback);
        },
    );
}

function handleQuery(bot: builder.UniversalBot, event: builder.IEvent, query: teams.ComposeExtensionQuery, callback: (err: Error, result: teams.IComposeExtensionResponse, statusCode: number) => void): void {
    let manifestInitialRun = "initialRun";
    let manifestParameterName = "query";
    let initialRunParameter = getQueryParameterByName(query, manifestInitialRun);
    let queryParameter = getQueryParameterByName(query, manifestParameterName);

    if (!initialRunParameter && !queryParameter) {
        callback(new Error("Parameter mismatch in manifest"), null, 500);
        return;
    }

    let address = event.address;
    bot.loadSession(address, (err: any, session: builder.Session) => {
        if (!err) {
            if (!session.userData) {
                let response = teams.ComposeExtensionResponse.message()
                    .text("ERROR: No user data")
                    .toResponse();
                callback(null, response, 200);
                return;
            }

            if (query.state) {
                parseSettingsAndSave(query.state, session);

                queryParameter = "";
                initialRunParameter = "true";
            }

            if (!session.userData.composeExtensionCardType) {
                let configResponse = getConfigResponse();
                callback(null, configResponse, 200);
                return;
            }

            if (initialRunParameter) {
                let directionsResponse = teams.ComposeExtensionResponse.message()
                    .text("Initial run")
                    .toResponse();
                callback(null, directionsResponse, 200);
                return;
            }

            let cardsAsAttachments = new Array<teams.ComposeExtensionAttachment>();

            for (let i = 0; i < 5; i++) {
                let cardTitle = "Title";
                let cardText = "Text";
                
                let card: builder.ThumbnailCard = null;
                if (session.userData.composeExtensionCardType === "thumbnail") {
                    card = new builder.ThumbnailCard();
                } else {
                    card = new builder.HeroCard();
                }
                card.title(cardTitle)
                    .text(cardText)
                    .images([new builder.CardImage().url(config.get("app.baseUri") + "/assets/sample_icon_color.png")]);

                let previewCard = new builder.ThumbnailCard()
                    .title(cardTitle)
                    .text(cardText)
                    .images([new builder.CardImage().url(config.get("app.baseUri") + "/assets/sample_icon_color.png")]);

                let cardAsAttachment: teams.ComposeExtensionAttachment = card.toAttachment();
                cardAsAttachment.preview = previewCard.toAttachment();
                
                cardsAsAttachments.push(cardAsAttachment);
            }

            let responseObject = teams.ComposeExtensionResponse.result("list");
            let response = responseObject.attachments(cardsAsAttachments).toResponse();
            callback(null, response, 200);
        } else {
            console.log("Error creating session");
        }
    });
}

function handleQuerySettingsUrl(event: builder.IEvent, query: teams.ComposeExtensionQuery, callback: (err: Error, result: teams.IComposeExtensionResponse, statusCode: number) => void): void {
    let configResponse = getConfigResponse();
    callback(null, configResponse, 200);
}

function handleSettingsUpdate(bot: builder.UniversalBot, event: builder.IEvent, query: teams.ComposeExtensionQuery, callback: (err: Error, result: teams.IComposeExtensionResponse, statusCode: number) => void): void {
    let address = event.address;
    bot.loadSession(address, (err: any, session: builder.Session) => {
        if (!err) {
            parseSettingsAndSave(query.state, session);
            callback(null, null, 200);
        } else {
            console.log("Error creating session");
        }
    });
}

function getQueryParameterByName(query: teams.ComposeExtensionQuery, name: string): string {
    let matchingParams = (query.parameters || []).filter(p => p.name === name);
    return matchingParams.length ? matchingParams[0].value : "";
}

function parseSettingsAndSave(state: any, session: builder.Session): void {
    let settingsState = JSON.parse(state);
    if (settingsState.cardType) {
        session.userData.composeExtensionCardType = settingsState.cardType;
        // this line is used to save the state for later use by the compose extension
        session.save().sendBatch();
    }
}

function getConfigResponse(): teams.IComposeExtensionResponse {
    let hardCodedUrl = config.get("app.baseUri") + "/composeExtensionSettingsPopup.html?width=5000&height=5000";
    let response = teams.ComposeExtensionResponse.config().actions([
        builder.CardAction.openUrl(null, hardCodedUrl, "Config"),
    ]).toResponse();
    return response;
}
