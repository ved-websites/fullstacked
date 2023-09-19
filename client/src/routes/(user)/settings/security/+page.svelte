<script lang="ts" context="module">
	import { mdiSecurity } from '@mdi/js';

	export const name = 'Security';
	export const icon = mdiSecurity;
</script>

<script lang="ts">
	import { Button, Helper, Input, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SettingPage from '../components/SettingPage.svelte';

	export let data;

	$: sessionUser = data.sessionUser!;

	const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<SettingPage routesInfo={data.routesInfo} {sessionUser} label={name}>
	<form method="POST" use:enhance class="grid gap-3 grid-cols-1 sm:grid-cols-2">
		<Label>
			<span> New Password </span>
			<Input
				name="password"
				class="mt-2"
				type="password"
				bind:value={$form.password}
				color={$errors.password ? 'red' : 'base'}
				{...$constraints.password}
			/>
			{#if $errors.password}<Helper class="mt-2" color="red">{$errors.password}</Helper>{/if}
		</Label>
		<Label>
			<span> Confirm New Password </span>
			<Input
				name="confirm"
				class="mt-2"
				type="password"
				bind:value={$form.confirm}
				color={$errors.confirm ? 'red' : 'base'}
				{...$constraints.confirm}
			/>
			{#if $errors.confirm}<Helper class="mt-2" color="red">{$errors.confirm}</Helper>{/if}
		</Label>

		<Button type="submit" class="mt-3 col-span-1 sm:col-span-2">Submit</Button>
	</form>
</SettingPage>
