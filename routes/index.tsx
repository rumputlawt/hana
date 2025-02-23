import { getCookies } from "@std/http/cookie";
import { decode } from "@gz/jwt";
import { define } from "~/utils/core.ts";
import { type APIGuildMember } from "@discordjs/core";
import { env } from "~/utils/env.ts";
import { page } from "fresh";

export const handler = define.handlers({
	async GET(ctx) {
		const cookies = getCookies(ctx.req.headers);
		const accessToken = cookies["access_token"];

		if (accessToken) {
			const member = await decode<APIGuildMember>(
				accessToken,
				env("JWT_KEY", true),
			);
			ctx.state.member = member;
		}

		return page();
	},
});

export default define.page((ctx) => {
	if (!ctx.state.member) {
		return (
			<div class="flex flex-col justify-center items-center min-h-full p-3 gap-2 select-none">
				<img class="pointer-events-none size-20" src="/logo.png" />
				<p class="font-bold text-lg mt-1">Login to access dashboard!</p>
				<div>
					<a
						class="bg-black px-4 py-2 text-white text-sm font-semibold rounded-full hover:shadow-xl hover:bg-white hover:text-black transition-all ease-in-out duration-200"
						href="/login"
					>
						Login with Discord
					</a>
				</div>
			</div>
		);
	} else {
		return <p>Logged in as {ctx.state.member.user.username}</p>;
	}
});
