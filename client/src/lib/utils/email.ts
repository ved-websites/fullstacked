import type { SendMailData } from '$/routes/api/email/schemas';
import type { SvelteComponent } from 'svelte';
import { render } from 'svelte-email';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export function sendEmail<Component extends SvelteComponent>(
	fetcher: typeof fetch,
	renderer: Parameters<typeof render<Component>>[0],
	body: Optional<SendMailData, 'html'>,
) {
	const emailHtml = render(renderer);

	return fetcher('/api/email', {
		body: JSON.stringify({
			html: emailHtml,
			...body,
		} satisfies SendMailData),
		method: 'POST',
	});
}
