<script lang="ts">
	import Oval from './spinners/Oval.svelte';

	let classes: string = '';

	export { classes as class };

	export let height: svelte.JSX.SVGAttributes<SVGSVGElement>['height'] = '100%';

	export let promise: Promise<unknown>;

	export let doHide: boolean = false;

	// export let name: string = Date.now().toString();

	$: promise && promise.catch(() => {}).then(() => (isDone = true));

	let isDone = false;
	$: isHidden = doHide && isDone;
</script>

{#if !isHidden}
	<div class="h-6 {classes}">
		{#await promise}
			<slot>
				<Oval {height} />
			</slot>
		{:then}
			<!-- Check Inline SVG -->
			<svg
				class="bi bi-check min-h-full fill-current text-green-600"
				{height}
				viewBox="2.5 2.5 15 15"
				preserveAspectRatio="xMidYMin slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M15.854 5.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L8.5 12.293l6.646-6.647a.5.5 0 01.708 0z"
					clip-rule="evenodd"
				/>
			</svg>
		{:catch}
			<!-- Octagon Inline SVG -->
			<svg
				class="bi bi-check min-h-full fill-current text-red-600"
				{height}
				viewBox="0 0 20 20"
				preserveAspectRatio="xMidYMin slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M6.54 2.146A.5.5 0 016.893 2h6.214a.5.5 0 01.353.146l4.394 4.394a.5.5 0 01.146.353v6.214a.5.5 0 01-.146.353l-4.394 4.394a.5.5 0 01-.353.146H6.893a.5.5 0 01-.353-.146L2.146 13.46A.5.5 0 012 13.107V6.893a.5.5 0 01.146-.353L6.54 2.146zM7.1 3L3 7.1v5.8L7.1 17h5.8l4.1-4.1V7.1L12.9 3H7.1z"
					clip-rule="evenodd"
				/>
				<rect width="2" height="2" x="9.002" y="12" rx="1" />
				<path d="M9.1 6.995a.905.905 0 111.8 0l-.35 3.507a.553.553 0 01-1.1 0L9.1 6.995z" />
			</svg>
		{/await}
	</div>
{/if}
