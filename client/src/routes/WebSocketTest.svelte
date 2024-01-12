<script lang="ts">
	import { dev } from '$app/environment';
	import { getApiUrl } from '$lib/utils';
	import SuperSocket from '@shippr/supersocket';
	import { onMount } from 'svelte';
	import { WsStatusCodes, type EventRouteInput, type wsR } from '~contract';

	onMount(() => {
		const socketUrl = getApiUrl().href.replace('http', 'ws');

		const socket = new SuperSocket(socketUrl, [], {
			secureOnly: !dev,
		});

		// TODO : Create library that re-subscribes on open
		// If the server dies, so does this connection - the SuperSocket library handles
		// reconnection, but if the server dies or the client loses internet, the server
		// unsubs all subbed events for this socket. Therefore, storing the subs requests
		// will be necessary on the client.

		socket.onopen = () => {
			console.log('Connected');

			socket.send({
				event: 'messages.chat',
				data: {
					type: 'subscribe',
					uid: 'my-uid',
					input: {
						closeOnIncludes: 'ok',
					},
				} satisfies EventRouteInput<typeof wsR.messages.new>,
			});

			// setTimeout(() => {
			// 	socket.send({
			// 		event: 'messages.chat',
			// 		data: {
			// 			type: 'unsubscribe',
			// 			uid: 'my-uid',
			// 		} satisfies EventRouteInput<typeof wsR.messages.chat>,
			// 	});
			// }, 1000 * 10);

			socket.onmessage = ({ data }) => {
				console.log(data);
			};

			socket.onerror = (test) => {
				console.log({ ctx: 'testingErr', test });
			};

			socket.onclose = (event) => {
				console.log({ ctx: 'closed! :(', event });

				if (event.code === WsStatusCodes.CLOSE_ABNORMAL) {
					socket.connect();
				}
			};
		};
	});
</script>
