export function parseCookies(cookieHeader: string | undefined) {
	const list: Record<string, string> = {};

	if (!cookieHeader) return list;

	cookieHeader.split(`;`).forEach(function (cookie) {
		const [name, ...rest] = cookie.split(`=`);

		const trimmedName = name?.trim();

		if (!trimmedName) return;
		const value = rest.join(`=`).trim();

		if (!value) return;
		list[trimmedName] = decodeURIComponent(value);
	});

	return list;
}
