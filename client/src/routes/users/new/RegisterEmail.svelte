<script lang="ts">
	import { Button, Hr, Html, Preview, Text } from 'svelte-email';

	export let email: string;
	export let name: string | undefined;
	export let url: string;
</script>

<Preview preview="You have been invited to join the Fullstacked Website!" />

<Html lang="en">
	<Text>
		Hello, {name ?? email}!
	</Text>
	<Hr />
	<Button href={url}>Register now!</Button>
</Html>
