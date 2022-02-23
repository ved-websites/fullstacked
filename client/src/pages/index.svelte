<!-- routify:meta title="Hello!" -->
<script lang="ts">
	import { mdiSend, mdiThumbUp } from '@mdi/js';
	import { Svg } from '@smui/common/elements';
	import Button, { Label, Icon } from '@smui/button';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';

	let focused = false;
	let value: string | null = null;
	let dirty = false;
	let invalid = false;
	$: disabled = focused || !value || !dirty || invalid;

	function clickHandler() {
		alert(`Sending to ${value}!`);
		value = null;
		dirty = false;
	}

	let clicked = 0;

	function handleClick(event: CustomEvent | MouseEvent) {
		event = event as MouseEvent;
		if (event.button === 0) {
			clicked++;
		} else if (event.button === 1) {
			clicked = 0;
		}
	}
</script>

<Textfield
	type="email"
	bind:dirty
	bind:invalid
	updateInvalid
	bind:value
	label="To"
	style="min-width: 250px;"
	input$autocomplete="email"
	on:focus={() => (focused = true)}
	on:blur={() => (focused = false)}
	withTrailingIcon={!disabled}
>
	<!--
      Since this icon is conditional, it needs to be wrapped
      in a fragment, and we need to provide withTrailingIcon.
    -->
	<svelte:fragment slot="trailingIcon">
		{#if !disabled}
			<Icon role="button" component={Svg} viewBox="0 0 24 24" on:click={clickHandler}>
				<path fill="currentColor" d={mdiSend} />
			</Icon>
		{/if}
	</svelte:fragment>
	<HelperText validationMsg slot="helper">That's not a valid email address.</HelperText>
</Textfield>

<Button on:mousedown={handleClick}>
	<Icon component={Svg} viewBox="0 0 24 24">
		<path fill="currentColor" d={mdiThumbUp} />
	</Icon>
	<Label>Click Me</Label>
</Button>

<p class="mdc-typography--body1">
	{#if clicked}
		You've clicked the button {clicked} time{clicked === 1 ? '' : 's'}. Middle click the button to reset.
	{:else}
		<span class="grayed">You haven't clicked the button.</span>
	{/if}
</p>

{#each Array(50) as item}
	<br />
{/each}

<span>Hi!</span>

<style>
	.grayed {
		opacity: 0.6;
	}
</style>
