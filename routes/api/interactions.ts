import { define } from "~/utils/core.ts";
import { env } from "~/utils/env.ts";
import tweetnacl from "tweetnacl";
import { decodeHex } from "@std/encoding/hex";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import {
	type APIInteraction,
	type APIInteractionResponsePong,
	InteractionResponseType,
	InteractionType,
} from "@discordjs/core";
import { type CommandResponse, findCommand } from "~/utils/command.ts";
import {
	isSlashCommandInteraction,
	replyInteraction,
} from "~/utils/interaction.ts";

export const handler = define.handlers({
	async POST(ctx) {
		const signature = ctx.req.headers.get("x-signature-ed25519");
		const timestamp = ctx.req.headers.get("x-signature-timestamp");

		if (!signature || !timestamp) {
			throw new Error(
				'Missing "x-signature-ed25519" or "x-signature-timestamp" header',
			);
		} else {
			const body = await ctx.req.text();
			const publicKey = env("DISCORD_PUBLIC_KEY", true);

			const valid = tweetnacl.sign.detached.verify(
				new TextEncoder().encode(timestamp + body),
				decodeHex(signature),
				decodeHex(publicKey),
			);

			if (!valid) {
				throw new HttpError(
					STATUS_CODE.Unauthorized,
					"Invalid Signature",
				);
			} else {
				const interaction: APIInteraction = JSON.parse(body);

				switch (interaction.type) {
					case InteractionType.ApplicationCommand: {
						let response: CommandResponse = replyInteraction({
							content: "invalid command",
						});

						if (isSlashCommandInteraction(interaction)) {
							const slashCommand = await findCommand(
								ctx.config.mode,
								interaction.data.name,
								interaction.data.type,
							);

							if (slashCommand) {
								response = slashCommand.execute(interaction);
							}
						}

						return Response.json(response);
					}
					case InteractionType.Ping: {
						const response: APIInteractionResponsePong = {
							type: InteractionResponseType.Pong,
						};
						return Response.json(response);
					}
					default: {
						throw new HttpError(STATUS_CODE.NotImplemented);
					}
				}
			}
		}
	},
});
