<script lang="ts">
	import { sessionToken } from '$/lib/stores/index.js';
	import { applyAction } from '$app/forms';
	import { Button, Helper, Input, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { enhance, form, constraints, errors } = superForm(data.form, {
		applyAction: false,
		onResult({ result }) {
			if (result.type === 'redirect') {
				const authSession = result.location.match(/\.*accessToken=(.*)(?:&.*)?/)?.[1];

				if (authSession) {
					sessionToken.set(authSession);
					result.location = result.location.replace(/\?accessToken=[^&]+/, '');
				}
			}

			applyAction(result);
		},
	});
</script>

<form method="post" use:enhance>
	<div class="gap-6 mb-6 md:grid-cols-2">
		<div>
			<Label for="email" class="mb-2">Email</Label>
			<Input let:props>
				<input {...props} type="email" name="email" placeholder="example@example.com" bind:value={$form.email} {...$constraints.email} />
			</Input>
			{#if $errors.email}<Helper color="red">{$errors.email}</Helper>{/if}
		</div>
		<div>
			<Label for="password" class="mb-2">Password</Label>
			<Input let:props>
				<input {...props} type="password" name="password" bind:value={$form.password} {...$constraints.password} />
			</Input>
			{#if $errors.password}<Helper color="red">{$errors.password}</Helper>{/if}
		</div>

		<Button type="submit" class="mt-5">Submit</Button>
	</div>
</form>
