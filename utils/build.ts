import { Command } from "~/utils/command.ts";
import { walk } from "@std/fs/walk";
import { Mode } from "fresh";

export async function build(mode: Mode) {
	const commandFiles = await Array.fromAsync(walk("./commands", {
		maxDepth: 1,
		includeDirs: false,
		includeSymlinks: false,
	}));

	const manifestStr = `
    import { type Manifest } from "~/utils/build.ts";
    ${
		commandFiles.map((ctx, id) =>
			`import $${id} from "~/commands/${ctx.name}";`
		).join("\n")
	}
    
    export default {
        commands: [
            ${commandFiles.map((_ctx, id) => `$${id}`).join(",\n")}
        ]
    } satisfies Manifest`;

	const manifestFilename = mode === "production"
		? "bot.gen.ts"
		: "dev.gen.ts";
	await Deno.writeTextFile(manifestFilename, manifestStr);
	await new Deno.Command(Deno.execPath(), {
		args: ["fmt", manifestFilename],
	}).output();
}

export interface Manifest {
	commands: Command[];
}
