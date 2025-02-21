import {
	type APIApplicationCommandInteraction,
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionResponseChannelMessageWithSource,
	type APIInteractionResponseDeferredChannelMessageWithSource,
	type APIMessageApplicationCommandInteraction,
	type APIModalInteractionResponse,
	type APIUserApplicationCommandInteraction,
	ApplicationCommandType,
	type RESTPostAPIApplicationCommandsJSONBody,
	type RESTPostAPIChatInputApplicationCommandsJSONBody,
	type RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "@discordjs/core";
import { type Mode } from "fresh";
import { type Manifest } from "~/utils/build.ts";

export async function findCommand(
	mode: Mode,
	commandName: string,
	commandType: ApplicationCommandType.ChatInput,
): Promise<SlashCommand | undefined>;
export async function findCommand(
	mode: Mode,
	commandName: string,
	commandType: ApplicationCommandType.Message,
): Promise<MessageContextMenuCommand | undefined>;
export async function findCommand(
	mode: Mode,
	commandName: string,
	commandType: ApplicationCommandType.User,
): Promise<UserContextMenuCommand | undefined>;
export async function findCommand(
	mode: Mode,
	commandName: string,
	commandType: ApplicationCommandType,
) {
	const manifestFilename = mode === "production"
		? "~/bot.gen.ts"
		: "~/dev.gen.ts";
	const { default: manifest }: { default: Manifest } = await import(
		manifestFilename
	);

	const command = manifest.commands.find((command) =>
		command.data.name === commandName && command.data.type === commandType
	);
	return command;
}

export function slashCommand(
	{ data, execute }: SlashCommand,
): SlashCommand {
	return {
		data: { ...data, type: ApplicationCommandType.ChatInput },
		execute,
	};
}
export function messageContextMenuCommand(
	{ data, execute }: MessageContextMenuCommand,
): MessageContextMenuCommand {
	return {
		data: { ...data, type: ApplicationCommandType.Message },
		execute,
	};
}
export function userContextMenuCommand(
	{ data, execute }: UserContextMenuCommand,
): UserContextMenuCommand {
	return {
		data: { ...data, type: ApplicationCommandType.User },
		execute,
	};
}

interface BaseCommand<
	Data extends RESTPostAPIApplicationCommandsJSONBody,
	Interaction extends APIApplicationCommandInteraction,
> {
	data: Data;
	execute: (interaction: Interaction) => CommandResponse;
}

export type SlashCommand = BaseCommand<
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	APIChatInputApplicationCommandInteraction
>;
export type MessageContextMenuCommand = BaseCommand<
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
	APIMessageApplicationCommandInteraction
>;
export type UserContextMenuCommand = BaseCommand<
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
	APIUserApplicationCommandInteraction
>;
export type Command =
	| SlashCommand
	| MessageContextMenuCommand
	| UserContextMenuCommand;

export type CommandResponse =
	| APIInteractionResponseChannelMessageWithSource
	| APIInteractionResponseDeferredChannelMessageWithSource
	| APIModalInteractionResponse;
