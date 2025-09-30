<script lang="ts">
	import UserForm from '$lib/components/UserForm/UserForm.svelte';
	import ValidationErrors from '$lib/components/forms/ValidationErrors.svelte';
	import { context } from '$lib/runes';
	import { Badge, Heading, Label, MultiSelect, type SelectOptionType } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';

	let {
		i18n: { t },
	} = $derived(context());

	let { data } = $props();

	const superFormData = superForm(data.form);
	const { form, errors } = superFormData;

	let availableRoles = $derived(
		data.roles.map<SelectOptionType<string>>((role) => ({
			name: $t(`shared.userform.roles.${role.text}`),
			value: role.text,
		})),
	);
</script>

<Heading tag="h2" class="overflow-x-clip text-ellipsis">{$t('admin.users.[email].heading', { email: data.editableUser?.email })}</Heading>

<UserForm {superFormData} class="col-span-2 order-1 sm:order-none">
	{#snippet below()}
		<div>
			<Label>{$t('shared.userform.labels.roles')}</Label>
			<MultiSelect name="roles" class="mt-2" items={availableRoles} bind:value={$form.roles} color={$errors.roles ? 'red' : 'default'}>
				{#snippet children({ item, clear })}
					<Badge
						color="primary"
						dismissable={!item.disabled}
						params={{ duration: 100 }}
						onclose={clear}
						class={[item.disabled && 'pointer-events-none']}
					>
						{item.name}
					</Badge>
				{/snippet}
			</MultiSelect>
			<ValidationErrors errors={$errors.roles} />
		</div>
	{/snippet}
</UserForm>
