import { define } from "~/utils/core.ts";

export default define.page(({ Component }) => {
	return (
		<html>
			<head>
				<meta charset="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>Hana</title>
				<link rel="stylesheet" href="/styles.css" />
			</head>
			<body>
				<div class="h-dvh font-[Poppins]">
					<Component />
				</div>
			</body>
		</html>
	);
});
