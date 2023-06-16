<script lang="ts">
	let klass = '';
	export { klass as class };

	export let path: string;

	export let size = '20px';
	export let width = size;
	export let height = size;
	export let viewWidth = '24';
	export let viewHeight = '24';
	export let rotate = 0;
	export let spin = false;
	export let disabled = false;
	export let label: string | null = null;
	export let style: string | null = null;

	$: {
		width = size;
		height = size;
	}
</script>

<i
	aria-label={label}
	aria-disabled={disabled}
	aria-hidden="true"
	class="s-icon {klass}"
	class:spin
	class:disabled
	style="--icon-size: {size}; --icon-rotate: {rotate}deg; {style ? style : ''}"
>
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 {viewWidth} {viewHeight}">
		<path d={path}>
			{#if label}
				<title>{label}</title>
			{/if}
		</path>
	</svg>
	<slot />
</i>

<style lang="postcss">
	.s-icon {
		font-size: var(--icon-size);
		transform: rotate(var(--icon-rotate));
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-flex;
		font-feature-settings: 'liga';
		justify-content: center;
		position: relative;
		align-items: center;
		text-indent: 0;
		vertical-align: middle;
		cursor: inherit;
		user-select: none;
		direction: ltr;
		transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;

		&.spin {
			animation: infinite s-icon-spin linear 1s;
		}

		& > svg {
			fill: currentColor;
		}
	}

	@keyframes s-icon-spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
