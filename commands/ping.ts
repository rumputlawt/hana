import { slashCommand } from "~/utils/command.ts";
import { replyInteraction } from "~/utils/interaction.ts";

export default slashCommand({
	data: {
		name: "ping",
		description: "Ping pong!",
	},
	execute(_interaction) {
		return replyInteraction({ content: "pong" });
	},
});
