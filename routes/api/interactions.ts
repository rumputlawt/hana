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
