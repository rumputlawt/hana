import { createDefine } from "fresh";
import { env } from "~/utils/env.ts";
import { API, type APIGuildMember } from "@discordjs/core";
import { REST } from "@discordjs/rest";

export interface State {
	member?: APIGuildMember;
}

export const define = createDefine<State>();
export const kv = await Deno.openKv();

export function defineApi(token?: string, authPrefix?: "Bearer" | "Bot") {
	const apiToken = token ?? env("DISCORD_TOKEN", true);
	const api = new API(
		new REST({ authPrefix, version: "10" }).setToken(apiToken),
	);
	return api;
}
