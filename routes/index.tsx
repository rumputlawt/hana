import { define } from "~/utils/core.ts";

export default define.page((_ctx) => {
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
});
