import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { define, defineApi } from "~/utils/core.ts";
import { env } from "~/utils/env.ts";
import { encode } from "@gz/jwt";
import { setCookie } from "@std/http/cookie";

export const handler = define.handlers({
	async GET(ctx) {
		const code = ctx.url.searchParams.get("code");

		if (!code) {
			throw new HttpError(STATUS_CODE.Unauthorized, "Invalid code");
		} else {
			const { access_token } = await defineApi().oauth2.tokenExchange({
				client_id: env("DISCORD_ID", true),
				client_secret: env("DISCORD_SECRET", true),
				grant_type: "authorization_code",
				code,
				redirect_uri: env("DISCORD_REDIRECT_URI", true),
			});

			const memberApi = defineApi(access_token, "Bearer");
			const member = await memberApi.users.getGuildMember(
				env("DISCORD_GUILD_ID", true),
			);

			const expireAt = (Math.floor(Date.now()) / 1000) + 60 * 60;
			const jwt = await encode(
				{ ...member, exp: expireAt },
				env("JWT_KEY", true),
			);

			const headers = new Headers({ location: "/" });
			setCookie(headers, {
				name: "access_token",
				value: jwt,
				expires: Math.floor(Date.now()) + (expireAt * 1_000),
				httpOnly: true,
				path: "/",
			});

			return new Response(null, { headers, status: STATUS_CODE.Found });
		}
	},
});
