import {
	type APIApplicationCommandInteraction,
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionResponseCallbackData,
	type APIInteractionResponseChannelMessageWithSource,
	type APIMessageApplicationCommandInteraction,
	type APIUserApplicationCommandInteraction,
	ApplicationCommandType,
	InteractionResponseType,
} from "@discordjs/core";

export function isSlashCommandInteraction(
	interaction: APIApplicationCommandInteraction,
): interaction is APIChatInputApplicationCommandInteraction {
	return interaction.data.type === ApplicationCommandType.ChatInput;
}
export function isMessageContextMenuCommandInteraction(
	interaction: APIApplicationCommandInteraction,
): interaction is APIMessageApplicationCommandInteraction {
	return interaction.data.type === ApplicationCommandType.Message;
}
export function isUserContextMenuCommandInteraction(
	interaction: APIApplicationCommandInteraction,
): interaction is APIUserApplicationCommandInteraction {
	return interaction.data.type === ApplicationCommandType.User;
}

export function replyInteraction(
	data: APIInteractionResponseCallbackData,
): APIInteractionResponseChannelMessageWithSource {
	return {
		type: InteractionResponseType.ChannelMessageWithSource,
		data,
	};
}
