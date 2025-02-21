import {
	type APIApplicationCommandInteraction,
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	type APIInteractionResponseDeferredChannelMessageWithSource,
	type APIModalInteractionResponse,
	ApplicationCommandType,
	type RESTPostAPIApplicationCommandsJSONBody,
	type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "@discordjs/core";

export function slashCommand(
	{ data, execute }: BaseCommand<
		RESTPostAPIChatInputApplicationCommandsJSONBody,
		APIChatInputApplicationCommandInteraction
	>,
) {
	return {
		data: { ...data, type: ApplicationCommandType.ChatInput },
		execute,
	};
}

interface BaseCommand<
	Data extends RESTPostAPIApplicationCommandsJSONBody,
	Interaction extends APIApplicationCommandInteraction,
> {
	data: Omit<Data, "type">;
	execute: (interaction: Interaction) => CommandResponse;
}

export type Command = ReturnType<typeof slashCommand>;

export type CommandResponse =
	| APIInteractionResponseChannelMessageWithSource
	| APIInteractionResponseDeferredChannelMessageWithSource
	| APIModalInteractionResponse;
