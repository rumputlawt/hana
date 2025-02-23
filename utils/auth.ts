import { OAuth2Scopes } from "@discordjs/core";
import { defineApi } from "~/utils/core.ts";
import { env } from "~/utils/env.ts";

export function createAuthUrl() {
	const scopes = [OAuth2Scopes.Identify];
	const authUrl = defineApi().oauth2.generateAuthorizationURL({
		client_id: env("DISCORD_ID", true),
		response_type: "code",
		scope: scopes.join(" "),
		redirect_uri: env("DISCORD_REDIRECT_URI", true),
	});

	return authUrl;
}
