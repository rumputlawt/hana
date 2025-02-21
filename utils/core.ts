import { createDefine } from "fresh";
import { env } from "~/utils/env.ts";
import { API } from "@discordjs/core";
import { REST } from "@discordjs/rest";

// deno-lint-ignore no-empty-interface
export interface State {}

export const define = createDefine<State>();
export const kv = await Deno.openKv();

export function defineApi(token?: string, authPrefix?: "Bearer" | "Bot") {
	const apiToken = token ?? env("DISCORD_TOKEN", true);
	const api = new API(
		new REST({ authPrefix, version: "10" }).setToken(apiToken),
	);
	return api;
}
