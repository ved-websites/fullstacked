<script lang="ts">
	import { cn } from '$lib/twMerge';

	interface Props {
		class?: string;
		[key: string]: any;
	}

	let { class: klass = '', ...rest }: Props = $props();

	let classes = $derived(cn('s-5', klass));
</script>

<span {...rest} class={classes}></span>
