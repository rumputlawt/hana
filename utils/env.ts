export function env(key: string, required: true): string;
export function env(key: string, required?: boolean): string | undefined;
export function env(key: string, required?: boolean) {
	const value = Deno.env.get(key);

	if (!value && required) {
		throw new Error(`Env variable not found: "${key}"`);
	}

	return value;
}
