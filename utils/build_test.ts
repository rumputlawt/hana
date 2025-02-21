import { build } from "~/utils/build.ts";

Deno.test({
	name: "build test",
	async fn() {
		return await build("development");
	},
});
