import { createToasts } from '$lib/components/ToastManager/helper';
import type { PageMessages } from '$lib/types';
import { flashStore } from './flash';

export type StreamedPayload<T> = { success: true; data: T } | { success: false; error: string };

export async function streamed<T>(fn: () => Awaitable<T>): Promise<StreamedPayload<T>> {
	try {
		const data = await fn();

		return { success: true, data } as const;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'oh noes';

		return { success: false, error: errorMessage } as const;
	}
}

export type StreamedData<T extends Awaitable<StreamedPayload<unknown>>> = Awaited<T> extends StreamedPayload<infer D> ? D : never;

export async function handleStreamed<T>(
	stream: Awaitable<StreamedPayload<T>>,
	args: {
		onData: (data: T) => Awaitable<unknown>;
		onError?: (error: string) => Awaitable<PageMessages | void>;
	},
) {
	const result = await stream;

	if (result.success) {
		args.onData(result.data);
	} else {
		const pageMessagesData = (await args.onError?.(result.error)) ?? {
			toasts: createToasts({
				text: result.error,
				type: 'error',
			}),
		};

		const flash = flashStore();

		flash?.update(($flash) => {
			$flash = pageMessagesData;

			return $flash;
		});
	}
}
