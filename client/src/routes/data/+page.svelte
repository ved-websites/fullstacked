<script lang="ts">
	import type { GetInitialMessagesQuery } from '$/graphql/@generated';
	import { queryStore } from '$/lib/urql';
	import { gql } from '@urql/svelte';
	import { P } from 'flowbite-svelte';

	const messages = queryStore({
		query: gql<GetInitialMessagesQuery>`
			query GetInitialMessages {
				messages {
					text
					user {
						email
					}
				}
			}
		`,
	});
</script>

{#if $messages.fetching}
	<P>Fetching...</P>
{:else if $messages.error || !$messages.data}
	<P color="red">Error!</P>
	<P color="red">{$messages.error}</P>
{:else}
	{#each $messages.data.messages as message}
		<P>{message.user.email} : {message.text}</P>
	{/each}
{/if}
